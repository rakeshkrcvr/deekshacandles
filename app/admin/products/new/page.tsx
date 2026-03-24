import prisma from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return <ProductForm categories={categories} />;
}
