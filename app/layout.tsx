import "./globals.css"

export const metadata = {
  title: "DLMM Web UI",
  description: "DLMM Add Liquidity Interface"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
