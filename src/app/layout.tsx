import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react"

const inter = Roboto({
  subsets: ["latin"],
  weight: "400" 
})

export const metadata: Metadata = {title: "Pokemon Trading ⭐",}

const bigBoyStyle = {
  width: "100%",
  height: "100%"
}

export default function RootLayout({children,}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={bigBoyStyle}
    >
      <body
        style={bigBoyStyle}
        className={inter.className}
      >
        {children}
      </body>
    </html>
  )
}
