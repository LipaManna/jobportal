"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  registerWithConfirmSchema,
  RegisterWithConfirmSchema,
  loginSchema,
  LoginSchema,
} from "../auth.schema";
import { createSessionAndSetCookies } from "./use-cases/sessions";

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
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        role: role as any,
      },
    });
     await createSessionAndSetCookies(user.id)

    return { success: true, user };
  } catch (error: any) {
    console.error("Registration error:", error);

    throw new Error(
      error.message || "Something went wrong during registration",
    );
  }
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
      user: { id: user.id, email: user.email, name: user.name },
    };
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong during login");
  }
}
