import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city = searchParams.get("city");
  const landType = searchParams.get("landType");
  const minArea = searchParams.get("minArea");
  const maxArea = searchParams.get("maxArea");
  const areaUnit = searchParams.get("areaUnit");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");

  const session = await getAdminSession();
  const isAdmin = !!session;

  const where: Prisma.ListingWhereInput = {
    ...(!isAdmin && { status: "APPROVED" }),
    ...(city && { city }),
    ...(landType && { landType: landType as never }),
    ...(featured === "true" && { featured: true }),
    ...(minArea && maxArea && areaUnit && {
      areaUnit: areaUnit as never,
      areaValue: { gte: parseFloat(minArea), lte: parseFloat(maxArea) },
    }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, title: true, city: true, taluka: true, landType: true,
        areaValue: true, areaUnit: true, priceTotal: true, pricePerUnit: true,
        images: true, featured: true, verified: true, roadAccess: true,
        status: true, createdAt: true,
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return Response.json({ listings, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title, description, city, taluka, village, landType, areaValue, areaUnit,
    priceTotal, pricePerUnit, roadAccess, waterSource, images,
    ownerName, ownerPhone, ownerEmail,
  } = body;

  if (!title || !city || !landType || !areaValue || !areaUnit || !ownerName || !ownerPhone) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title, description, city, taluka, village, landType, areaValue: parseFloat(areaValue),
      areaUnit, priceTotal: priceTotal ? parseFloat(priceTotal) : null,
      pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : null,
      roadAccess: roadAccess === true || roadAccess === "true",
      waterSource, images: images ?? [],
      ownerName, ownerPhone, ownerEmail,
    },
  });

  return Response.json({ listing }, { status: 201 });
}
