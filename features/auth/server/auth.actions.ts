"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  registerWithConfirmSchema,
  RegisterWithConfirmSchema,
  loginSchema,
  LoginSchema,
} from "../auth.schema";
import { createSessionAndSetCookies, invalidateSession, validateSessionAndGetUser } from "./use-cases/sessions";
import { cookies } from "next/headers";
import crypto from "node:crypto";

export async function registration(data: RegisterWithConfirmSchema) {
  const parsedData = registerWithConfirmSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }
  const { name, email, username, password, role } = parsedData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  // Basic validation
  // if (password !== confirmPassword) {
  //   throw new Error("Passwords do not match");
  // }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("User with this email already exists");
    }
    if (existingUser.username === username) {
      throw new Error("Username is already taken");
    }
  }

  try {
    const user = await prisma.$transaction(async (tx) => {
      // 1. Create the base user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          username,
          password: hashedPassword,
          role: role as any,
        },
      });

      // 2. Create the associated profile based on the role
      if (role === "employer") {
        await tx.employer.create({
          data: {
            user_id: newUser.id,
            company_name: newUser.name, // Use user name as initial company name
          },
        });
      } else if (role === "applicant") {
        await tx.applicant.create({
          data: {
            user_id: newUser.id,
            biography: "",
            date_of_birth: new Date(),
            marital_status: "single",
            gender: "male",
            experience: "0",
            education: "bachelor",
            location: "",
          },
        });
      }

      return newUser;
    });

    // 3. Create session and set cookies (outside transaction as it involves headers)
    await createSessionAndSetCookies(user.id);

    return { success: true, user };
  } catch (error: any) {
    console.error("Registration error:", error);

    throw new Error(
      error.message || "Something went wrong during registration",
    );
  }
}

export async function validateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_token")?.value;
  if(!session) {
    throw new Error("No session found");
  }
  const user = await validateSessionAndGetUser(session);
  return user;
}

export async function login(data: LoginSchema) {
  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { email, password } = parsedData.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    await createSessionAndSetCookies(user.id, data.rememberMe)

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong during login");
  }
}

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};



export const logout = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_token")?.value;
  if(!session) {
    throw new Error("No session found");
  }
  await invalidateSession(hashToken(session));
  cookieStore.delete("session_token");
};
