import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#080C10]">
      <AppSidebar userName={session.user.name ?? session.user.email} />
      {/* Main content area — offset by sidebar width on desktop */}
      <main className="pt-14 md:ml-16 md:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
