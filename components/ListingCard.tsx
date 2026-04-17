import Link from "next/link";
import Image from "next/image";
import { LAND_TYPE_LABELS, AREA_UNIT_LABELS, formatPrice } from "@/lib/utils";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    city: string;
    taluka?: string | null;
    landType: string;
    areaValue: number;
    areaUnit: string;
    priceTotal?: number | null;
    pricePerUnit?: number | null;
    images: string[];
    featured: boolean;
    verified: boolean;
    roadAccess: boolean;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const img = listing.images[0];

  return (
    <Link href={`/listings/${listing.id}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {img ? (
          <Image src={img} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">🌾</div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {listing.featured && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Featured</span>
          )}
          {listing.verified && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">✓ Verified</span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {LAND_TYPE_LABELS[listing.landType] ?? listing.landType}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          📍 {listing.city}{listing.taluka ? `, ${listing.taluka}` : ""}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            {listing.areaValue} {AREA_UNIT_LABELS[listing.areaUnit] ?? listing.areaUnit}
          </span>
          <span className="font-bold text-green-700 text-base">
            {formatPrice(listing.priceTotal)}
          </span>
        </div>

        {listing.roadAccess && (
          <p className="text-xs text-blue-600 mt-2">🛣 Road Access Available</p>
        )}
      </div>
    </Link>
  );
}
