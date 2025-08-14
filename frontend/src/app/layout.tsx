"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/components/providers";
import { MusicProvider } from "@/contexts/music-context";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthInitializer } from "@/components/auth-initializer";
import Head from "next/head";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Music App</title>
        <meta name="description" content="Your music streaming platform" />
        <link rel="apple-touch-icon" href="/musical.png" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <AuthInitializer />
          <QueryProvider>
            <MusicProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster richColors position="bottom-right" />
              </ThemeProvider>
            </MusicProvider>
          </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}
