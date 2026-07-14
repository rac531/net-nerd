import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'netnerd',
  description: 'CCNA study & portfolio site',
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