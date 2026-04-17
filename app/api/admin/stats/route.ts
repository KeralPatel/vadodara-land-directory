import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalListings,
    pendingListings,
    approvedListings,
    totalEnquiries,
    newEnquiries,
    dealsClosed,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "PENDING" } }),
    prisma.listing.count({ where: { status: "APPROVED" } }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { status: "DEAL_CLOSED" } }),
  ]);

  return Response.json({
    totalListings,
    pendingListings,
    approvedListings,
    totalEnquiries,
    newEnquiries,
    dealsClosed,
  });
}
