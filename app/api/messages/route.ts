import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        budget: data.budget || null,
        message: data.message,
      },
    });

    return NextResponse.json({ success: true, id: message.id }, { status: 201 });
  } catch (error) {
    console.error("Save message error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
