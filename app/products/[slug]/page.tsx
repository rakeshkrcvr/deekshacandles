import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const product = await prisma.product.findUnique({
    where: { slug: decodedSlug },
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | Deeksha Candles`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const product = await prisma.product.findUnique({
    where: { slug: decodedSlug },
    include: {
      images: true,
      category: true,
      reviews: true,
      details: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#faf9f6]/30 min-h-screen pb-20">

      <div className="mt-4 lg:mt-6">
        <ProductClient product={product} />
      </div>
    </div>
  );
}
