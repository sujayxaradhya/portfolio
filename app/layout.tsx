import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Your Name — Developer Portfolio",
    template: "%s — Your Name",
  },
  description: "Selected work, experience, and contact information.",
  openGraph: {
    title: "Your Name — Developer Portfolio",
    description: "Selected work, experience, and contact information.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Your Name — Developer Portfolio",
    description: "Selected work, experience, and contact information.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-background text-foreground">
        <TooltipProvider>
          <main className="h-full">{children}</main>
        </TooltipProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}