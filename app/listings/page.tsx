import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";
import { CITIES, LAND_TYPE_LABELS } from "@/lib/utils";
import Link from "next/link";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ city?: string; landType?: string; featured?: string; page?: string }>;
}

export default async function ListingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const city = sp.city ?? "";
  const landType = sp.landType ?? "";
  const featured = sp.featured === "true";
  const page = parseInt(sp.page ?? "1");
  const limit = 12;

  const where = {
    status: "APPROVED" as const,
    ...(city && { city }),
    ...(landType && { landType: landType as never }),
    ...(featured && { featured: true }),
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
        images: true, featured: true, verified: true, roadAccess: true, status: true,
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  function buildUrl(overrides: Record<string, string | number | undefined>) {
    const params = new URLSearchParams();
    const merged = { city, landType, featured: featured ? "true" : "", page: String(page), ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return `/listings?${params.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {city ? `Land for Sale in ${city}` : "All Land Listings"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} listings found</p>
        </div>

        <form method="GET" action="/listings" className="flex flex-wrap gap-2">
          <select name="city" defaultValue={city} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">All Cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="landType" defaultValue={landType} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">All Types</option>
            {Object.entries(LAND_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
            Filter
          </button>
          {(city || landType || featured) && (
            <Link href="/listings" className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Clear
            </Link>
          )}
        </form>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🌾</div>
          <p className="text-lg font-medium">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your filters or check back soon</p>
          <Link href="/list-property" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
            Be the first to list
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={buildUrl({ page: page - 1 })} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  ← Prev
                </Link>
              )}
              <span className="text-sm text-gray-600">Page {page} of {pages}</span>
              {page < pages && (
                <Link href={buildUrl({ page: page + 1 })} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
