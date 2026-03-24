"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processImportBatch(batch: any[]) {
  let success = 0;
  const errors: { slug: string, reason: string }[] = [];

  for (const product of batch) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          title: product.title,
          description: product.description,
          price: product.price,
          specifications: product.specifications,
          badges: product.badges,
          imageUrls: product.imageUrls
        },
        create: {
          slug: product.slug,
          title: product.title,
          description: product.description,
          price: product.price,
          specifications: product.specifications,
          badges: product.badges,
          imageUrls: product.imageUrls
        }
      });
      success++;
    } catch (e: any) {
      errors.push({ slug: product.slug, reason: e.message });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  
  return { success, errors };
}

export async function exportProductsCsv() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const headers = [
    "Handle",
    "Title",
    "Body (HTML)",
    "Vendor",
    "Variant Price",
    "Image Src",
    "Image Position",
    "Tags"
  ];

  const rows: string[][] = [];
  rows.push(headers);

  products.forEach(product => {
    // Reconstruct tags from specs and badges
    const safeBadges = product.badges || [];
    const safeImages = product.imageUrls || [];
    const tagsArr = [...safeBadges];
    if (product.specifications) {
      const specs = product.specifications as any;
      if (specs["Burn Time"]) tagsArr.push(`Burn Time: ${specs["Burn Time"]}`);
      if (specs["Wax Material"]) tagsArr.push(`Wax: ${specs["Wax Material"]}`);
      if (specs["Fragrance Notes"]) tagsArr.push(`Fragrance: ${specs["Fragrance Notes"]}`);
      if (specs["Net Weight"]) tagsArr.push(`Weight: ${specs["Net Weight"]}`);
      if (specs["Jar Material & Dimensions"]) tagsArr.push(`Jar: ${specs["Jar Material & Dimensions"]}`);
    }
    const tagsString = tagsArr.join(", ");

    // Ensure we always have at least one row for the product even if no images
    if (safeImages.length === 0) {
      rows.push([
        product.slug,
        product.title,
        (product.description || "").replace(/"/g, '""'), // basic csv escaping
        "Deeksha Candles",
        product.price.toString(),
        "",
        "",
        tagsString
      ]);
    } else {
      safeImages.forEach((imgUrl: string, i: number) => {
        // Only first row of grouped product needs title, description, price, tags
        if (i === 0) {
          rows.push([
            product.slug,
            product.title,
            (product.description || "").replace(/"/g, '""'),
            "Deeksha Candles",
            product.price.toString(),
            imgUrl,
            (i + 1).toString(),
            tagsString
          ]);
        } else {
          rows.push([
            product.slug,
            "",
            "",
            "",
            "",
            imgUrl,
            (i + 1).toString(),
            ""
          ]);
        }
      });
    }
  });

  // Basic CSV stringification
  return rows.map(r => r.map(c => c.includes(",") || c.includes('"') || c.includes("\n") ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n');
}
