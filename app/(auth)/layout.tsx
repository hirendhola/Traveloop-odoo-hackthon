import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left — form area */}
      <div className="flex w-full items-center justify-center bg-[#080C10] px-4 py-12 md:w-1/2 lg:px-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Right — travel photo (desktop only) */}
      <div className="relative hidden w-1/2 md:block">
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80"
          alt="Adventure awaits"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.85)] via-[rgba(8,12,16,0.2)] to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="font-heading text-3xl font-light text-[#F0EDE6] leading-tight">
            "The world is a book and those who do not travel read only one page."
          </p>
          <p className="mt-3 text-sm text-[rgba(240,237,230,0.5)]">— Saint Augustine</p>
        </div>
      </div>
    </div>
  );
}
