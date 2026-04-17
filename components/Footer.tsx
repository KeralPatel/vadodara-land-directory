import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏡</span>
              <span className="font-bold text-lg text-white">Lands N Trade</span>
            </div>
            <p className="text-sm leading-relaxed">
              Gujarat&apos;s trusted land marketplace. Connecting buyers, sellers, and
              investors across Vadodara and surrounding cities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" className="hover:text-white transition-colors">Browse All Land</Link></li>
              <li><Link href="/list-property" className="hover:text-white transition-colors">List for Free</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Cities We Cover</h3>
            <ul className="space-y-1 text-sm">
              {["Vadodara", "Anand", "Nadiad", "Ahmedabad", "Surat", "Bharuch"].map((city) => (
                <li key={city}>
                  <Link href={`/listings?city=${city}`} className="hover:text-white transition-colors">
                    Land in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} Lands N Trade. All rights reserved. Brokerage services provided.
        </div>
      </div>
    </footer>
  );
}
