import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check user in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let isValid = false;

    if (user) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } else if (
      email === (process.env.ADMIN_EMAIL || "admin@deadlock.studio") &&
      password === (process.env.ADMIN_PASSWORD || "deadlock2026!")
    ) {
      // Direct env fallback
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      userId: user?.id || "admin_direct",
      email: email,
      role: "admin",
    });

    const response = NextResponse.json({ success: true, message: "Session initialized" });
    response.cookies.set("deadlock_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication internal error" }, { status: 500 });
  }
}
