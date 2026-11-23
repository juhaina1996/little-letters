import type { Metadata, Viewport } from "next";
import { Baloo_2, Noto_Naskh_Arabic, Noto_Sans_Devanagari, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["500", "700", "800"] });
const devanagari = Noto_Sans_Devanagari({ variable: "--font-devanagari", subsets: ["devanagari"], weight: ["500", "700"] });
const arabic = Noto_Naskh_Arabic({ variable: "--font-arabic", subsets: ["arabic"], weight: ["500", "700"] });
const malayalam = Noto_Sans_Malayalam({ variable: "--font-malayalam", subsets: ["malayalam"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Little Letters",
  description: "Learn Hindi, Arabic and Malayalam letters and simple words",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${devanagari.variable} ${arabic.variable} ${malayalam.variable} antialiased`}>
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-4">{children}</main>
      </body>
    </html>
  );
}
