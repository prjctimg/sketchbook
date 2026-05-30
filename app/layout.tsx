import type { Metadata } from "next";
import "./globals.css";
import siteMeta from "@/sitemeta.json";
import Script from "next/script";

const gaId = siteMeta.ga?.measurementId;

export const metadata: Metadata = {
  title: siteMeta.site.title,
  description: siteMeta.site.description,
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
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
