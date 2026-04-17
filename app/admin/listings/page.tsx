import { prisma } from "@/lib/prisma";
import { LAND_TYPE_LABELS, AREA_UNIT_LABELS, formatPrice, LISTING_STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";
import AdminListingActions from "@/components/AdminListingActions";

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminListingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status ?? "";
  const page = parseInt(sp.page ?? "1");
  const limit = 15;

  const where = status ? { status: status as never } : {};

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);
  const statuses = ["", "PENDING", "APPROVED", "REJECTED", "SOLD"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s ? `/admin/listings?status=${s}` : "/admin/listings"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === s ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No listings found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Listing</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Area / Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/listings/${l.id}`} target="_blank" className="font-medium text-gray-900 hover:text-green-700 line-clamp-1">
                      {l.title}
                    </Link>
                    <p className="text-xs text-gray-500">{l.city}{l.taluka ? ` · ${l.taluka}` : ""}</p>
                    <p className="text-xs text-gray-400">{l.ownerName} · {l.ownerPhone}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                    {LAND_TYPE_LABELS[l.landType] ?? l.landType}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                    <div>{l.areaValue} {AREA_UNIT_LABELS[l.areaUnit]}</div>
                    <div className="text-green-700 font-medium">{formatPrice(l.priceTotal)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LISTING_STATUS_COLORS[l.status]}`}>
                      {l.status}
                    </span>
                    {l.featured && <span className="ml-1 text-xs">⭐</span>}
                  </td>
                  <td className="px-4 py-3">
                    <AdminListingActions listingId={l.id} currentStatus={l.status} featured={l.featured} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={`/admin/listings?${status ? `status=${status}&` : ""}page=${page - 1}`} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              ← Prev
            </Link>
          )}
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          {page < pages && (
            <Link href={`/admin/listings?${status ? `status=${status}&` : ""}page=${page + 1}`} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
