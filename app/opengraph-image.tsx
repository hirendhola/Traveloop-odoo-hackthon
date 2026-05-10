import { ImageResponse } from "next/og"

export const alt = "Traveloop — Intelligent Travel Planning"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080C10",
          position: "relative",
        }}
      >
        {/* Subtle gold gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#E8C547",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            background: "#E8C547",
            borderRadius: 16,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 44,
              fontWeight: 600,
              color: "#080C10",
            }}
          >
            T
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 72,
            fontWeight: 300,
            color: "#F0EDE6",
            marginBottom: 16,
          }}
        >
          Traveloop
        </h1>
        <p
          style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 24,
            color: "rgba(240,237,230,0.6)",
          }}
        >
          Personalized Travel Planning Made Easy
        </p>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 40,
            fontFamily: "'Geist', sans-serif",
            fontSize: 14,
            color: "rgba(240,237,230,0.35)",
          }}
        >
          traveloop.app
        </div>
      </div>
    ),
    { ...size }
  )
}
