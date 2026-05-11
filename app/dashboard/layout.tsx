export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { authGuard } from "@/lib/authGuard";
import { Sidebar } from "../../components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // await authGuard(undefined, ["ADMIN"]);
  await authGuard("admin");
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
