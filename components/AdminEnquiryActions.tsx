"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["NEW", "CONTACTED", "NEGOTIATING", "DEAL_CLOSED", "NO_RESPONSE"];

export default function AdminEnquiryActions({
  enquiryId, currentStatus, adminNote,
}: {
  enquiryId: string;
  currentStatus: string;
  adminNote: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState(adminNote);
  const [saving, setSaving] = useState(false);

  async function patch(data: Record<string, unknown>) {
    setSaving(true);
    await fetch(`/api/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-2 min-w-40">
      <select
        value={currentStatus}
        onChange={(e) => patch({ status: e.target.value })}
        disabled={saving}
        className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
      </select>

      <div className="flex gap-1">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add note..."
          className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 min-w-0"
        />
        <button
          onClick={() => patch({ adminNote: note })}
          disabled={saving}
          className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}
