import { prisma } from "@/lib/prisma";
import { ClientHome } from "@/components/ClientHome";

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return <ClientHome initialProjects={projects} />;
}
