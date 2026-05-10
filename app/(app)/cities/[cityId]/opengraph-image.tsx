import { ImageResponse } from "next/og"
import { db } from "@/lib/prisma"

export const alt = "City on Traveloop"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function CityOpenGraphImage({
  params,
}: {
  params: Promise<{ cityId: string }>
}) {
  const { cityId } = await params

  const city = await db.city.findUnique({
    where: { id: cityId },
  })

  const cityName = city?.name ?? "City"
  const country = city?.country ?? ""

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
        {city?.coverImageUrl && (
          <img
            src={city.coverImageUrl}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
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
          {country && (
            <p
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 16,
                color: "#E8C547",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              {country}
            </p>
          )}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 72,
              fontWeight: 300,
              color: "#F0EDE6",
              lineHeight: 1.1,
            }}
          >
            {cityName}
          </h1>
          <p
            style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: 20,
              color: "rgba(240,237,230,0.5)",
              marginTop: 8,
            }}
          >
            Explore {cityName} on Traveloop
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
