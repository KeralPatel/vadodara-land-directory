"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/listings", label: "Listings", icon: "🏡" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "📩" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-700">
        <div className="font-bold text-lg">🏡 Lands N Trade</div>
        <div className="text-xs text-gray-400 mt-1">Admin Panel</div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2 truncate">{email}</div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
