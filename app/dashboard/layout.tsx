import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav, TabBar } from "@/components/Nav";
import { Toaster } from "@/components/Toaster";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  // Verified locally against the project's signing keys — no Auth-server round-trip.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) redirect("/login");

  return (
    <div className="min-h-screen">
      <TopNav email={(claims.email as string) ?? ""} />
      <main className="mx-auto w-full max-w-[1080px] px-4 pb-28 pt-6 sm:px-6 sm:pt-10 md:pb-20">
        {children}
      </main>
      <TabBar />
      <Toaster />
    </div>
  );
}
