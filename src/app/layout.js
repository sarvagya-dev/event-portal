import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BasicUnstop — Discover & Join Events",
  description:
    "Find hackathons, workshops, competitions, and seminars. Register instantly. Build your profile.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <span className="font-semibold text-foreground/60">BasicUnstop</span>
            <span>© {new Date().getFullYear()} BasicUnstop. Empowering student communities.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
