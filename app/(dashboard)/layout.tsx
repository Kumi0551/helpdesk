// import "./globals.css";
// import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Metadata, Viewport } from "next";
import { SidebarProvider } from "../Components/SidebarContext";
import Navbar from "../Components/Navbar/page";
import SideBarNav from "../Components/Sidebar/page";

/* const montserrate = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});
 */
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
      {/* <body className={montserrate.className}> */}

      <body>
        <Toaster />
        <SidebarProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <div className="pt-20 flex flex-1 overflow-hidden">
              <SideBarNav />
              <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-60 transition-all duration-300 overflow-x-auto">
                <div className="max-w-full">{children}</div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
