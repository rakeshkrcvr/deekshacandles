import prisma from "@/lib/prisma";
import ProductForm from "../../new/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { details: true }
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany();

  return <ProductForm categories={categories} initialData={product} />;
}
