"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏡</span>
            <span className="font-bold text-lg text-green-700">
              Lands N Trade
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/listings" className="text-gray-600 hover:text-green-700 transition-colors">
              Browse Listings
            </Link>
            <Link href="/list-property" className="text-gray-600 hover:text-green-700 transition-colors">
              List Property
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-700 transition-colors">
              About
            </Link>
            <Link
              href="/list-property"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Free Listing
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 text-sm font-medium">
          <Link href="/listings" className="block py-2 text-gray-700 hover:text-green-700" onClick={() => setOpen(false)}>
            Browse Listings
          </Link>
          <Link href="/list-property" className="block py-2 text-gray-700 hover:text-green-700" onClick={() => setOpen(false)}>
            List Property
          </Link>
          <Link href="/about" className="block py-2 text-gray-700 hover:text-green-700" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/list-property" className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={() => setOpen(false)}>
            Free Listing
          </Link>
        </div>
      )}
    </nav>
  );
}
