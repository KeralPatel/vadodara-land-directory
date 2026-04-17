import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";
import { CITIES } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, countResult] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "APPROVED", featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, city: true, taluka: true, landType: true,
        areaValue: true, areaUnit: true, priceTotal: true, pricePerUnit: true,
        images: true, featured: true, verified: true, roadAccess: true, status: true,
      },
    }),
    prisma.listing.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, city: true, taluka: true, landType: true,
        areaValue: true, areaUnit: true, priceTotal: true, pricePerUnit: true,
        images: true, featured: true, verified: true, roadAccess: true, status: true,
      },
    }),
    prisma.listing.count({ where: { status: "APPROVED" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Land for Sale in<br />Vadodara &amp; Gujarat
          </h1>
          <p className="text-green-100 text-lg mb-8">
            Agricultural, residential &amp; commercial land across Vadodara, Anand, Nadiad,
            Ahmedabad, Surat &amp; Bharuch
          </p>

          <form action="/listings" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <select
              name="city"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              name="landType"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All Land Types</option>
              <option value="AGRICULTURAL">Agricultural</option>
              <option value="NA_RESIDENTIAL">NA Residential</option>
              <option value="NA_COMMERCIAL">NA Commercial</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="FARM_HOUSE">Farm House</option>
              <option value="PLOT">Plot</option>
            </select>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-700">{countResult}+</div>
            <div className="text-sm text-gray-500 mt-1">Active Listings</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">6</div>
            <div className="text-sm text-gray-500 mt-1">Cities Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">Free</div>
            <div className="text-sm text-gray-500 mt-1">For Sellers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">Trusted</div>
            <div className="text-sm text-gray-500 mt-1">Brokerage Service</div>
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by City</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/listings?city=${city}`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-green-500 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-1">📍</div>
              <div className="font-medium text-sm text-gray-800 group-hover:text-green-700">{city}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
            <Link href="/listings?featured=true" className="text-sm text-green-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      {/* Latest Listings */}
      {latest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
            <Link href="/listings" className="text-sm text-green-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latest.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-green-50 border-t border-green-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Want to Sell Your Land?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          List your agricultural, residential, or commercial land for free. Reach thousands of buyers across Gujarat.
        </p>
        <Link
          href="/list-property"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors"
        >
          List Your Land — It&apos;s Free
        </Link>
      </section>
    </div>
  );
}
