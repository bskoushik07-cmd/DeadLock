import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        tagline: data.tagline,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        whatsapp: data.whatsapp,
        github: data.github,
        twitter: data.twitter,
        linkedin: data.linkedin,
        servicesJson: typeof data.servicesJson === "string" ? data.servicesJson : JSON.stringify(data.servicesJson || []),
        statsJson: typeof data.statsJson === "string" ? data.statsJson : JSON.stringify(data.statsJson || []),
      },
      create: {
        id: "default",
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        tagline: data.tagline,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        whatsapp: data.whatsapp,
        github: data.github,
        twitter: data.twitter,
        linkedin: data.linkedin,
        servicesJson: typeof data.servicesJson === "string" ? data.servicesJson : JSON.stringify(data.servicesJson || []),
        statsJson: typeof data.statsJson === "string" ? data.statsJson : JSON.stringify(data.statsJson || []),
      },
    });

    revalidatePath("/");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
