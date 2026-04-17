import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { _count: { select: { enquiries: true } } },
  });

  if (!listing) return Response.json({ error: "Not found" }, { status: 404 });
  if (listing.status !== "APPROVED" && !session) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ listing });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const listing = await prisma.listing.update({
    where: { id },
    data: body,
  });

  return Response.json({ listing });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.listing.delete({ where: { id } });
  return Response.json({ ok: true });
}
