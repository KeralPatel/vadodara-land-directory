import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: body,
    include: { listing: { select: { id: true, title: true, city: true } } },
  });

  return Response.json({ enquiry });
}
