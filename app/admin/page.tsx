import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalListings, pendingListings, approvedListings, rejectedListings,
    totalEnquiries, newEnquiries, dealsClosed,
    recentEnquiries,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "PENDING" } }),
    prisma.listing.count({ where: { status: "APPROVED" } }),
    prisma.listing.count({ where: { status: "REJECTED" } }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { status: "DEAL_CLOSED" } }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { listing: { select: { title: true, city: true } } },
    }),
  ]);

  const cards = [
    { label: "Total Listings", value: totalListings, color: "bg-blue-50 text-blue-700", link: "/admin/listings" },
    { label: "Pending Review", value: pendingListings, color: "bg-yellow-50 text-yellow-700", link: "/admin/listings?status=PENDING" },
    { label: "Approved", value: approvedListings, color: "bg-green-50 text-green-700", link: "/admin/listings?status=APPROVED" },
    { label: "Total Enquiries", value: totalEnquiries, color: "bg-purple-50 text-purple-700", link: "/admin/enquiries" },
    { label: "New Enquiries", value: newEnquiries, color: "bg-red-50 text-red-700", link: "/admin/enquiries?status=NEW" },
    { label: "Deals Closed", value: dealsClosed, color: "bg-emerald-50 text-emerald-700", link: "/admin/enquiries?status=DEAL_CLOSED" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.link} className={`${c.color} rounded-xl p-5 hover:opacity-80 transition-opacity`}>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-sm font-medium mt-1 opacity-80">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-xs text-green-700 hover:underline">View all</Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No enquiries yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentEnquiries.map((e) => (
              <div key={e.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-500 truncate">{e.listing.title} — {e.listing.city}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{e.phone}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  e.status === "NEW" ? "bg-blue-100 text-blue-700" :
                  e.status === "DEAL_CLOSED" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {e.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        {rejectedListings > 0 && (
          <p className="text-xs text-gray-400">{rejectedListings} rejected listings hidden</p>
        )}
      </div>
    </div>
  );
}
