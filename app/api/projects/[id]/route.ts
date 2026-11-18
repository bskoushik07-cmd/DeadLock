import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        client: data.client,
        year: data.year,
        role: data.role,
        category: data.category,
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
        coverImage: data.coverImage,
        galleryImages: typeof data.galleryImages === "string" ? data.galleryImages : JSON.stringify(data.galleryImages || []),
        videoUrl: data.videoUrl,
        liveUrl: data.liveUrl,
        repoUrl: data.repoUrl,
        accentColor: data.accentColor,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        order: Number(data.order || 0),
      },
    });

    revalidatePath("/");
    revalidatePath(`/projects/${updated.slug}`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
