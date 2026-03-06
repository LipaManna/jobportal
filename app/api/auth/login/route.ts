import { login } from "@/features/auth/server/auth.actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await login(body);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 400 },
    );
  }
}
