import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";
const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = generateSlug(decodeURIComponent(slug));
  const pages = await prisma.content.findMany();
  const page = pages.find((p: any) => generateSlug(p.title) === decodedSlug);
  
  if (!page) return { title: 'Page Not Found' };
  
  return {
    title: `${page.title} | Deeksha Candles`,
    description: page.body.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...',
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = generateSlug(decodeURIComponent(slug));
  
  const pages = await prisma.content.findMany();
  const page = pages.find((p: any) => generateSlug(p.title) === decodedSlug);
  console.log("CustomPage request:", { rawSlug: slug, decodedSlug, foundPage: !!page, allPages: pages.map(p => generateSlug(p.title)) });

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 min-h-[60vh]">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">
           {page.title}
        </h1>
        <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: page.body }} />
      </div>
    </div>
  );
}
