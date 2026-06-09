import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة المسافر للصين",
  description: "بوابة حصرية للمسافرين والتجار - إدارة لوجستية وتنسيق يومي فخم",
  keywords: "الصين, قوانغتشو, Canton Fair, معرض الكانتون, الجزائر, استيراد",
};

// السماح للمستخدمين بالتحكم في تكبير الشاشة — معيار وصول WCAG إجباري
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* تحسين سرعة جلب الخطوط — يمنع Layout Shift */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
