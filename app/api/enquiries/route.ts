import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const where = status ? { status: status as never } : {};

  const [enquiries, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      include: { listing: { select: { id: true, title: true, city: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.enquiry.count({ where }),
  ]);

  return Response.json({ enquiries, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { listingId, name, phone, email, message } = body;

  if (!listingId || !name || !phone) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const listing = await prisma.listing.findFirst({
    where: { id: listingId, status: "APPROVED" },
  });

  if (!listing) return Response.json({ error: "Listing not found" }, { status: 404 });

  const enquiry = await prisma.enquiry.create({
    data: { listingId, name, phone, email, message },
  });

  return Response.json({ enquiry }, { status: 201 });
}
