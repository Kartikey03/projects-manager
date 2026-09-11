import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DesktopSidebar,
  MobileTopBar,
  MobileBottomNav,
} from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar email={user.email ?? ""} />
      {/* min-w-0 lets this column shrink instead of forcing horizontal scroll */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 px-4 py-6 pb-28 sm:px-6 md:px-8 md:py-10 md:pb-10">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
