/* eslint-disable @typescript-eslint/no-explicit-any */
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import type { Metadata } from "next";
import { PermissionProvider } from "./lib/permission/PermissionProvider";

export const metadata: Metadata = {
  generator: "Wibu Dock",
  applicationName: "Wibu Dock",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "JavaScript"],
  metadataBase: new URL("https://wibu-dock.ravenstone.cloud"),
  title: "Wibu Dock",
  description: "Wibu Dock",
  openGraph: {
    title: "Wibu Dock",
    description: "Comprehensive Dock for Wibu web app.",
    url: "https://wibu-dock.ravenstone.cloud",
    siteName: "Wibu Dock",
    images: "/og-image.png",
    authors: ["makuro", "malik kurosaki"]
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png"
    }
  },
  twitter: {
    card: "summary_large_image",
    title: "Wibu Dock",
    description: "Comprehensive Dock for Wibu web app.",
    siteId: "1467726470533754880",
    creator: "@makuro",
    creatorId: "1467726470533754880",
    images: ["https://wibu-dock.ravenstone.cloud/og-image.png"] // Must be an absolute URL
  },
  verification: {
    google: "google",
    yandex: "yandex",
    yahoo: "yahoo",
    other: {
      me: ["my-email", "my-link"]
    }
  },
  category: "technology"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; frame-ancestors 'self'; media-src 'self' https://localhost:3000;"
        /> */}
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <PermissionProvider />
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}

// wibu:0.2.29
