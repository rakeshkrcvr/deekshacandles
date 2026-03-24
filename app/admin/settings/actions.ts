"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const razorpayKeyId = formData.get("razorpayKeyId") as string;
  const razorpaySecret = formData.get("razorpaySecret") as string;
  const shiprocketEmail = formData.get("shiprocketEmail") as string;
  const shiprocketPassword = formData.get("shiprocketPassword") as string;

  await prisma.storeSettings.update({
    where: { id: "global" },
    data: {
      razorpayKeyId,
      razorpaySecret,
      shiprocketEmail,
      shiprocketPassword
    }
  });

  revalidatePath("/admin/settings");
}
