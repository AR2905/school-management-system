import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./[[...sign-in]]/loading";
import { Provider } from "react-redux";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMS | School Management System",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}> 
            <ClerkLoading>
              {/* Loading state while Clerk is loading */}
              <Loading />
            </ClerkLoading>
            <ClerkLoaded>
            {children}
              {/* Toast notifications */}
              <ToastContainer position="bottom-right" theme="dark" />
             
            </ClerkLoaded>
      
        </body>
      </ClerkProvider>
    </html>
  );
}
