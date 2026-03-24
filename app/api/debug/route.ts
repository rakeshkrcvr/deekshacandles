import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const pages = await prisma.content.findMany();
  return NextResponse.json(pages);
}
