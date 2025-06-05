import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/SessionProvider";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#181f2a',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteConfig = await prisma.siteConfig.findFirst();
    
    return {
      title: siteConfig?.title || '博客',
      description: siteConfig?.subtitle || '个人博客',
    };
  } catch (error) {
    console.error('Failed to fetch site config:', error);
    return {
      title: '博客',
      description: '个人博客',
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-[#181f2a] text-gray-100`}>
        <SessionProvider session={session}>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
