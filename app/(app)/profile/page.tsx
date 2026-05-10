import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ProfileClient } from "@/components/profile-client";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const [user, profile] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true },
    }),
    db.userProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        savedDestinations: {
          include: {
            city: { select: { id: true, name: true, country: true, coverImageUrl: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#0D1B2A]">
          Profile
        </h1>
        <p className="mt-1 text-sm text-[#5A6B7A]">Manage your account and preferences</p>
      </div>

      <ProfileClient
        userId={user.id}
        initialName={user.name ?? ""}
        email={user.email}
        initialImage={user.image ?? null}
        initialLanguage={profile?.languagePreference ?? "en"}
        savedCities={
          profile?.savedDestinations.map((sd) => ({
            id: sd.city.id,
            name: sd.city.name,
            country: sd.city.country,
            coverImageUrl: sd.city.coverImageUrl,
          })) ?? []
        }
      />
    </div>
  );
}
