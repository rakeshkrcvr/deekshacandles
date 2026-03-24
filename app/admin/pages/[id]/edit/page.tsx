import prisma from "@/lib/prisma";
import PageForm from "../../PageForm";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.content.findUnique({ where: { id } });
  
  if (!page) {
    notFound();
  }

  return <PageForm initialData={page} />;
}
