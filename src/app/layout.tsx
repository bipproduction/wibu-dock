/* eslint-disable @typescript-eslint/no-explicit-any */
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

export const metadata = {
  title: "Wibu Dock",
  description: "Wibu Dock",
  keywords: "Dock Station Wibu App", // Add relevant keywords
  author: "Wibu Team", // Specify the author or company name
  charset: "UTF-8", // Set the character encoding
  ogTitle: "Wibu Dock", // Open Graph title
  ogDescription: "Comprehensive Dock for Wibu web app.", // Open Graph description
  ogUrl: "https://wibu-dock.ravenstone.cloud", // Your website URL
  ogType: "website", // Open Graph type
  ogSiteName: "Wibu Dock",
  twitterSite: "@yourTwitterHandle", // Your Twitter handle
  twitterCreator: "@yourTwitterHandle", // Twitter creator (if applicable),
  robots: "index, follow", // Mengizinkan mesin pencari untuk mengindeks dan mengikuti tautan
  canonical: "https://wibu-dock.ravenstone.cloud", 
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}

// wibu:0.2.29
