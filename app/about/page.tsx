import Link from "next/link";
import { CITIES } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About VadodaraLand</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg">
          VadodaraLand is Gujarat&apos;s trusted land directory — connecting farmers, landowners, and
          investors with serious buyers across Vadodara, Anand, Nadiad, Ahmedabad, Surat, and Bharuch.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h2>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Sellers list their land for <strong>free</strong> — no registration required</li>
            <li>Our team reviews and publishes listings within 24 hours</li>
            <li>Interested buyers send enquiries through the platform</li>
            <li>Our brokerage team connects both parties and facilitates the deal</li>
          </ol>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">For Sellers</h3>
            <ul className="text-sm space-y-1 text-gray-600 list-disc list-inside">
              <li>100% free to list</li>
              <li>Reach thousands of buyers</li>
              <li>Verified listing badge available</li>
              <li>Your phone number stays private</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">For Buyers</h3>
            <ul className="text-sm space-y-1 text-gray-600 list-disc list-inside">
              <li>Browse verified listings</li>
              <li>Send enquiries instantly</li>
              <li>Expert brokerage assistance</li>
              <li>Covering all major talukas</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cities We Cover</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <Link key={city} href={`/listings?city=${city}`} className="bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                {city}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h2>
          <p className="text-sm text-gray-600">
            For any queries, reach us at{" "}
            <a href="mailto:info@vadodaraland.in" className="text-green-700 hover:underline">
              info@vadodaraland.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
