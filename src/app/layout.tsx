import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEOX Infinity - Multi-Tenant Admin Platform",
  description: "Production-ready multi-tenant administrative web application with comprehensive role-based access control, white-labeling, and OWASP security compliance.",
  icons: {
    icon: '/neoxfavicon.png',
    shortcut: '/neoxfavicon.png',
    apple: '/neoxfavicon.png',
  },
  keywords: [
    "multi-tenant",
    "admin platform",
    "RBAC",
    "white-label",
    "OWASP",
    "Next.js",
    "TypeScript",
    "Prisma",
    "NextAuth"
  ],
  authors: [{ name: "NEOX Team" }],
  creator: "NEOX Infinity",
  publisher: "NEOX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://neoxadminui-9rve53cfi-peter-vargas-projects.vercel.app'),
  openGraph: {
    title: "NEOX Infinity - Multi-Tenant Admin Platform",
    description: "Production-ready multi-tenant administrative web application",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEOX Infinity - Multi-Tenant Admin Platform",
    description: "Production-ready multi-tenant administrative web application",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/neoxfavicon.png" type="image/png" />
      </head>
      <body className="h-full antialiased">
        {children}
      </body>
    </html>
  );
}
