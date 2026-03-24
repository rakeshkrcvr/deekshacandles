"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveProductAction(formData: FormData) {
  const productId = formData.get("productId") as string | null;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat(formData.get("price") as string);
  const offerPriceRaw = formData.get("offerPrice");
  const parsedOfferPrice = offerPriceRaw ? parseFloat(offerPriceRaw as string) : NaN;
  const discount = !isNaN(parsedOfferPrice) && parsedOfferPrice > 0 ? Math.round(((price - parsedOfferPrice) / price) * 100) : null;
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  
  const offerText = formData.get("offerText") as string || null;
  const tripleTreatAlert = formData.get("tripleTreatAlert") as string || null;
  const deliveryEstimate = formData.get("deliveryDays") as string || null;
  
  const badgesStr = formData.get("badges") as string;
  const badges = badgesStr ? JSON.parse(badgesStr) : [];
  
  const specsStr = formData.get("specifications") as string;
  const specifications = specsStr ? JSON.parse(specsStr) : null;
  
  const imageUrls: string[] = [];
  
  const imagesList = formData.getAll("image");
  
  for (const item of imagesList) {
    if (typeof item === 'string' && item.trim() !== '') {
      imageUrls.push(item);
    } else if (typeof item === 'object' && item !== null && 'size' in item) {
      const file = item as File;
      if (file.size > 0 && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {}
      
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      imageUrls.push(`/uploads/${filename}`);
      }
    }
  }

  const hasCountdown = formData.get("countdownTimer") === 'true';
  const countdownExpiry = hasCountdown ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
  
  const dynamicSectionsStr = formData.get("dynamicSections") as string;
  const dynamicSections = dynamicSectionsStr ? JSON.parse(dynamicSectionsStr) : [];
  
  const detailsData = dynamicSections.map((sec: any) => ({
    label: sec.title,
    value: sec.content,
  }));
  
  // Note: For edit, we append to existing imageUrls if we only want to add, 
  // but to keep it simple we can just replace them entirely with the new array 
  // if images were managed on the client, or we could just update what is sent.
  // The client will send all previously uploaded URLs as pastedUrls, so `imageUrls` will represent the full final list.

  const dataPayload = {
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    description,
    categoryId: categoryId || null,
    price,
    discount,
    stock,
    offerTag: offerText,
    tripleTreatAlert,
    countdownExpiry,
    specifications,
    deliveryEstimate,
    badges,
    imageUrls
  };

  try {
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          ...dataPayload,
          details: {
            deleteMany: {},
            create: detailsData,
          }
        }
      });
    } else {
      await prisma.product.create({
        data: {
          ...dataPayload,
          details: {
            create: detailsData,
          }
        }
      });
    }
  } catch (err) {
    console.error("Failed to save product:", err);
    throw new Error("Failed to save product.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}
