import type { Metadata } from "next";
import "./globals.css";
import siteMeta from "@/sitemeta.json";

export const metadata: Metadata = {
  title: siteMeta.site.title,
  description: siteMeta.site.description,
  metadataBase: new URL(siteMeta.site.url),
  openGraph: {
    title: siteMeta.site.title,
    description: siteMeta.site.description,
    url: siteMeta.site.url,
    siteName: siteMeta.site.title,
    images: [{ url: siteMeta.site.image, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.site.title,
    description: siteMeta.site.description,
    images: [siteMeta.site.image],
    creator: siteMeta.site.twitterHandle,
  },
  keywords: siteMeta.site.keywords,
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme') || 'system';
                if (theme === 'system') {
                  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } else if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
