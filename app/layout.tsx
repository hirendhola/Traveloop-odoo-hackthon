import { Cormorant_Garamond, Geist, DM_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  display: "swap",
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Traveloop — Intelligent Travel Planning",
    template: "%s | Traveloop",
  },
  description:
    "Build beautiful multi-city itineraries in minutes — with everything from budget tracking to packing lists, beautifully organized.",
  keywords: ["travel", "itinerary", "trip planner", "budget travel", "travel app"],
  authors: [{ name: "Traveloop" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Traveloop",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@traveloop",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", cormorant.variable, geist.variable, dmMono.variable)}
    >
      <body className="font-sans">
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
