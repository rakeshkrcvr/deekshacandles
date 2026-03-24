"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function savePageAction(formData: FormData) {
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (id) {
    await prisma.content.update({
      where: { id },
      data: { title, body }
    });
  } else {
    await prisma.content.create({
      data: { title, body }
    });
  }

  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deletePageAction(id: string) {
  await prisma.content.delete({ where: { id } });
  revalidatePath("/admin/pages");
}
