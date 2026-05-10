import { ImageResponse } from "next/og"
import { db } from "@/lib/prisma"

export const alt = "Shared Trip on Traveloop"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function SharedTripOpenGraphImage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const trip = await db.trip.findUnique({
    where: { shareToken: token },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        take: 3,
        include: { city: true },
      },
    },
  })

  const tripName = trip?.name ?? "Shared Trip"
  const cities = trip?.stops.map((s) => s.city.name).join(", ") ?? ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#080C10",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {trip?.coverPhotoUrl && (
          <img
            src={trip.coverPhotoUrl}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(8,12,16,0.95) 0%, rgba(8,12,16,0.5) 50%, rgba(8,12,16,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: 48,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {cities && (
            <p
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 16,
                color: "#E8C547",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              {cities}
            </p>
          )}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 64,
              fontWeight: 300,
              color: "#F0EDE6",
              lineHeight: 1.1,
            }}
          >
            {tripName}
          </h1>
          <p
            style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: 20,
              color: "rgba(240,237,230,0.5)",
              marginTop: 8,
            }}
          >
            Check out this trip on Traveloop
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "#E8C547",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#080C10",
                }}
              >
                T
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 14,
                color: "rgba(240,237,230,0.4)",
              }}
            >
              Traveloop
            </p>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
