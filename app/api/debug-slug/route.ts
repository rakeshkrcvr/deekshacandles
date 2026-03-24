import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") || "about-us";
  const decodedSlug = generateSlug(decodeURIComponent(slug));
  
  const pages = await prisma.content.findMany();
  const page = pages.find((p: any) => generateSlug(p.title) === decodedSlug);
  
  return NextResponse.json({
    requestedSlug: slug,
    decodedSlug,
    allTitles: pages.map(p => p.title),
    allGeneratedSlugs: pages.map(p => generateSlug(p.title)),
    found: !!page,
    page: page || null
  });
}
