import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ToastProvider from '../components/common/ToastProvider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'E-Cell | Jaipur Engineering College',
  description: 'Entrepreneurship Cell - Fostering innovation and growth at Jaipur Engineering College',
  generator: 'v0.app',
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "E-Cell | Jaipur Engineering College",
  "url": "https://e-cell.jeckukas.org.in",
  "logo": "https://e-cell.jeckukas.org.in/logo.jpeg"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="CHm660O3L2Ar1nbD5zQ7QuWNgPffwTYREWU5lfnwKJ0" />
        <meta property="og:title" content="E-Cell | Jaipur Engineering College" />
        <meta property="og:description" content="Entrepreneurship Cell - Fostering innovation and growth at Jaipur Engineering College" />
        <meta property="og:image" content="https://e-cell.jeckukas.org.in/logo.jpeg" />
        <meta property="og:url" content="https://e-cell.jeckukas.org.in/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://e-cell.jeckukas.org.in/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <ToastProvider />
        <Analytics />
      </body>
    </html>
  )
}
