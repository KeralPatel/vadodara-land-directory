import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import EnquiryForm from "@/components/EnquiryForm";
import { LAND_TYPE_LABELS, AREA_UNIT_LABELS, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;

  const listing = await prisma.listing.findFirst({
    where: { id, status: "APPROVED" },
  });

  if (!listing) notFound();

  const similar = await prisma.listing.findMany({
    where: { status: "APPROVED", city: listing.city, id: { not: listing.id } },
    take: 3,
    select: {
      id: true, title: true, city: true, taluka: true, landType: true,
      areaValue: true, areaUnit: true, priceTotal: true, pricePerUnit: true,
      images: true, featured: true, verified: true, roadAccess: true, status: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-700">Home</Link>
        {" / "}
        <Link href="/listings" className="hover:text-green-700">Listings</Link>
        {" / "}
        <Link href={`/listings?city=${listing.city}`} className="hover:text-green-700">{listing.city}</Link>
        {" / "}
        <span className="text-gray-900 font-medium">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Photos + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <div className="grid gap-2">
            {listing.images.length > 0 ? (
              <>
                <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                </div>
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {listing.images.slice(1, 4).map((img, i) => (
                      <div key={i} className="relative h-24 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={img} alt={`${listing.title} ${i + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-80 rounded-xl bg-gray-100 flex items-center justify-center text-7xl">🌾</div>
            )}
          </div>

          {/* Title + Badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {LAND_TYPE_LABELS[listing.landType] ?? listing.landType}
              </span>
              {listing.verified && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">✓ Verified</span>
              )}
              {listing.featured && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">⭐ Featured</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{listing.title}</h1>
            <p className="text-gray-500 flex items-center gap-1">
              📍 {listing.city}{listing.taluka ? `, ${listing.taluka}` : ""}{listing.village ? `, ${listing.village}` : ""}
            </p>
          </div>

          {/* Key Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Area</p>
              <p className="font-semibold text-gray-900">
                {listing.areaValue} {AREA_UNIT_LABELS[listing.areaUnit] ?? listing.areaUnit}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total Price</p>
              <p className="font-semibold text-green-700 text-lg">{formatPrice(listing.priceTotal)}</p>
            </div>
            {listing.pricePerUnit && (
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Price / {AREA_UNIT_LABELS[listing.areaUnit]}</p>
                <p className="font-semibold text-gray-900">{formatPrice(listing.pricePerUnit)}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Road Access</p>
              <p className="font-semibold text-gray-900">{listing.roadAccess ? "✅ Yes" : "❌ No"}</p>
            </div>
            {listing.waterSource && (
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Water Source</p>
                <p className="font-semibold text-gray-900">{listing.waterSource}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-0.5">City</p>
              <p className="font-semibold text-gray-900">{listing.city}</p>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Property Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{listing.description}</p>
            </div>
          )}

          {/* Similar Listings */}
          {similar.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Similar Land in {listing.city}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similar.map((l) => {
                  const img = l.images[0];
                  return (
                    <Link key={l.id} href={`/listings/${l.id}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32 bg-gray-100">
                        {img ? <Image src={img} alt={l.title} fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-3xl">🌾</div>}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">{l.title}</p>
                        <p className="text-xs text-green-700 font-semibold mt-0.5">{formatPrice(l.priceTotal)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Enquiry Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{formatPrice(listing.priceTotal)}</p>
              <p className="text-sm text-gray-600">{listing.areaValue} {AREA_UNIT_LABELS[listing.areaUnit]}</p>
            </div>
            <EnquiryForm listingId={listing.id} listingTitle={listing.title} />
            <p className="text-xs text-center text-gray-400">
              Brokerage handled by VadodaraLand team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
