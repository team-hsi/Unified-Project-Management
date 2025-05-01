import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-client/query-provider";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/next-theme";
import { Toaster } from "sonner";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Unified Project Management",
  description: "A comprehensive platform for managing projects and tasks.",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          showSpinner={false}
          color={"var(--toploader)"}
          height={3}
        />
        <Toaster richColors position="top-right" />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
};
export default RootLayout;
