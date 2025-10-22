import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://your-domain.com'
  
  return {
    title: 'Merch MVP - Event SBT System',
    description: 'Claim event attendance SBTs and mint premium companion NFTs on Base Sepolia.',
    openGraph: {
      title: 'Merch MVP - Event SBT System',
      description: 'Claim event attendance SBTs and mint premium companion NFTs on Base Sepolia.',
      url: appUrl,
      siteName: 'Merch MVP',
      images: [
        {
          url: `${appUrl}/og-image.svg`,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Merch MVP - Event SBT System',
      description: 'Claim event attendance SBTs and mint premium companion NFTs on Base Sepolia.',
      images: [`${appUrl}/og-image.svg`],
    },
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${appUrl}/og-image.svg`,
        button: {
          title: 'Claim SBT',
          action: {
            type: 'launch_miniapp',
            name: 'Merch MVP',
            url: appUrl,
            splashImageUrl: `${appUrl}/splash.svg`,
            splashBackgroundColor: '#0052ff',
          },
        },
      }),
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
