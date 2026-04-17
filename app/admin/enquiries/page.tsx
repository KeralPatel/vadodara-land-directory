import { prisma } from "@/lib/prisma";
import { ENQUIRY_STATUS_LABELS, ENQUIRY_STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";
import AdminEnquiryActions from "@/components/AdminEnquiryActions";

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminEnquiriesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status ?? "";
  const page = parseInt(sp.page ?? "1");
  const limit = 20;

  const where = status ? { status: status as never } : {};

  const [enquiries, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { listing: { select: { id: true, title: true, city: true } } },
    }),
    prisma.enquiry.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);
  const statuses = ["", "NEW", "CONTACTED", "NEGOTIATING", "DEAL_CLOSED", "NO_RESPONSE"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s ? `/admin/enquiries?status=${s}` : "/admin/enquiries"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === s ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {ENQUIRY_STATUS_LABELS[s] ?? "All"}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 text-center py-12 text-gray-500">
            No enquiries found
          </div>
        ) : (
          enquiries.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{e.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ENQUIRY_STATUS_COLORS[e.status]}`}>
                      {ENQUIRY_STATUS_LABELS[e.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">📞 {e.phone}{e.email ? ` · ✉️ ${e.email}` : ""}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Property:{" "}
                    <Link href={`/listings/${e.listing.id}`} target="_blank" className="text-green-700 hover:underline">
                      {e.listing.title}
                    </Link>{" "}— {e.listing.city}
                  </p>
                  {e.message && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-2 italic">&quot;{e.message}&quot;</p>
                  )}
                  {e.adminNote && (
                    <p className="text-xs text-blue-700 mt-1 bg-blue-50 rounded px-2 py-1">Note: {e.adminNote}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <AdminEnquiryActions enquiryId={e.id} currentStatus={e.status} adminNote={e.adminNote ?? ""} />
              </div>
            </div>
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={`/admin/enquiries?${status ? `status=${status}&` : ""}page=${page - 1}`} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              ← Prev
            </Link>
          )}
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          {page < pages && (
            <Link href={`/admin/enquiries?${status ? `status=${status}&` : ""}page=${page + 1}`} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
