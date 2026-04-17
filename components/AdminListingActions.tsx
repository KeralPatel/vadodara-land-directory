"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminListingActions({
  listingId, currentStatus, featured,
}: {
  listingId: string;
  currentStatus: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(data: Record<string, unknown>) {
    setLoading(true);
    await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this listing permanently?")) return;
    setLoading(true);
    await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-1">
      {currentStatus !== "APPROVED" && (
        <button onClick={() => patch({ status: "APPROVED" })} disabled={loading} className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors disabled:opacity-50">
          Approve
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button onClick={() => patch({ status: "REJECTED" })} disabled={loading} className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors disabled:opacity-50">
          Reject
        </button>
      )}
      {currentStatus !== "SOLD" && (
        <button onClick={() => patch({ status: "SOLD" })} disabled={loading} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors disabled:opacity-50">
          Sold
        </button>
      )}
      <button onClick={() => patch({ featured: !featured })} disabled={loading} className={`text-xs px-2 py-1 rounded transition-colors disabled:opacity-50 ${featured ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
        {featured ? "Unfeature" : "Feature"}
      </button>
      <button onClick={handleDelete} disabled={loading} className="text-xs px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded transition-colors disabled:opacity-50">
        Del
      </button>
    </div>
  );
}
