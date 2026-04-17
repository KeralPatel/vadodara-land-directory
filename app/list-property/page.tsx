"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/lib/utils";

export default function ListPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", city: "", taluka: "", village: "",
    landType: "", areaValue: "", areaUnit: "", priceTotal: "", pricePerUnit: "",
    roadAccess: false, waterSource: "", ownerName: "", ownerPhone: "", ownerEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to submit");
      }
      router.push("/list-property/success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelCls = "block text-xs font-semibold text-gray-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List Your Land for Free</h1>
        <p className="text-gray-500 mt-2">Fill in the details below. Our team will review and publish within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">

        {/* Property Details */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">Property Details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Listing Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="e.g. 5 Acre Agricultural Land in Padra, Vadodara" />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls + " resize-none"} placeholder="Describe the land, nearby landmarks, special features..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>City *</label>
                <select required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls}>
                  <option value="">Select City</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Taluka</label>
                <input value={form.taluka} onChange={(e) => set("taluka", e.target.value)} className={inputCls} placeholder="e.g. Padra" />
              </div>
              <div>
                <label className={labelCls}>Village</label>
                <input value={form.village} onChange={(e) => set("village", e.target.value)} className={inputCls} placeholder="e.g. Vadadla" />
              </div>
            </div>
          </div>
        </div>

        {/* Land Type & Area */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">Land Type &amp; Area</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Land Type *</label>
              <select required value={form.landType} onChange={(e) => set("landType", e.target.value)} className={inputCls}>
                <option value="">Select Type</option>
                <option value="AGRICULTURAL">Agricultural</option>
                <option value="NA_RESIDENTIAL">NA Residential</option>
                <option value="NA_COMMERCIAL">NA Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="FARM_HOUSE">Farm House</option>
                <option value="PLOT">Plot</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className={labelCls}>Area *</label>
                <input required type="number" min="0.01" step="0.01" value={form.areaValue} onChange={(e) => set("areaValue", e.target.value)} className={inputCls} placeholder="e.g. 5" />
              </div>
              <div className="w-36">
                <label className={labelCls}>Unit *</label>
                <select required value={form.areaUnit} onChange={(e) => set("areaUnit", e.target.value)} className={inputCls}>
                  <option value="">Unit</option>
                  <option value="BIGHA">Bigha</option>
                  <option value="ACRE">Acre</option>
                  <option value="GUNTHA">Guntha</option>
                  <option value="SQ_FT">Sq Ft</option>
                  <option value="SQ_METER">Sq Meter</option>
                  <option value="HECTARE">Hectare</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Total Price (₹)</label>
              <input type="number" min="0" value={form.priceTotal} onChange={(e) => set("priceTotal", e.target.value)} className={inputCls} placeholder="Leave blank for 'Price on Request'" />
            </div>
            <div>
              <label className={labelCls}>Price per Unit (₹)</label>
              <input type="number" min="0" value={form.pricePerUnit} onChange={(e) => set("pricePerUnit", e.target.value)} className={inputCls} placeholder="Optional" />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="roadAccess" checked={form.roadAccess} onChange={(e) => set("roadAccess", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
              <label htmlFor="roadAccess" className="text-sm font-medium text-gray-700">Road Access Available</label>
            </div>
            <div>
              <label className={labelCls}>Water Source</label>
              <input value={form.waterSource} onChange={(e) => set("waterSource", e.target.value)} className={inputCls} placeholder="e.g. Bore well, Canal, River" />
            </div>
          </div>
        </div>

        {/* Owner Details */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">Your Contact Details</h2>
          <p className="text-xs text-gray-500 mb-3">Your contact info will only be shared with interested buyers via our team. It won&apos;t be publicly visible.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input required value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} className={inputCls} placeholder="Your name" />
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <input required type="tel" value={form.ownerPhone} onChange={(e) => set("ownerPhone", e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.ownerEmail} onChange={(e) => set("ownerEmail", e.target.value)} className={inputCls} placeholder="optional@email.com" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-green-700 transition-colors disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Listing for Review"}
        </button>
        <p className="text-xs text-center text-gray-400">Free listing. No hidden charges. Our team reviews within 24 hours.</p>
      </form>
    </div>
  );
}
