import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeVault | The Secure Cloud Vault for Resumes & CVs",
  description: "Securely store, organize, parse, and download multiple versions of your resume. Free unlimited uploads for students, job seekers, and professionals.",
  keywords: ["resume", "CV", "resume vault", "job seeker", "student CV portfolio", "resume cloud manager", "ATS friendly resume"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#030307] text-[#f8fafc]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

