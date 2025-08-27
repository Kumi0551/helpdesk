import "./globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Metadata, Viewport } from "next";

const montserrate = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loyalty-HelpDesk",
  description: "Loyalty Insurance staff helpdesk",
  // viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export const viewport: Viewport = {
  themeColor: "black",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrate.className}>
        <Toaster />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="transition-all duration-300 overflow-x-auto">
            <div className="max-w-full">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
