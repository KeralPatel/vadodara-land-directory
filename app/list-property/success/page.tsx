import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for listing your property. Our team will review it and publish within 24 hours.
          We&apos;ll contact you if we need any additional information.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/listings" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors">
            Browse Listings
          </Link>
          <Link href="/list-property" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
            List Another
          </Link>
        </div>
      </div>
    </div>
  );
}
