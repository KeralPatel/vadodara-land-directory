import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar email={session.email} />
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
