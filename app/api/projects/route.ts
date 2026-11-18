import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Auto-generate slug if missing
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: slug,
        client: data.client || "Confidential",
        year: data.year || "2026",
        role: data.role || "Full-Stack Development",
        category: data.category || "WebGL / Web",
        shortDesc: data.shortDesc || "",
        longDesc: data.longDesc || "",
        coverImage: data.coverImage || "/projects/kinetic-labs.svg",
        galleryImages: data.galleryImages ? JSON.stringify(data.galleryImages) : "[]",
        videoUrl: data.videoUrl || null,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
        accentColor: data.accentColor || "#C6FF3D",
        featured: Boolean(data.featured),
        published: Boolean(data.published ?? true),
        order: Number(data.order || 0),
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
