import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Navbar from "@/components/general/Navbar";
import { AuthProvider } from "./components/general/AuthProvider";
import { Toaster } from "sonner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bet You Can't",
  description: "Challenge your friends and make it count for charity!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Create or update user in database when they log in
  if (user?.email) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.given_name ? `${user.given_name} ${user.family_name || ''}`.trim() : undefined,
          profilePic: user.picture || undefined,
        },
        create: {
          email: user.email,
          name: user.given_name ? `${user.given_name} ${user.family_name || ''}`.trim() : undefined,
          profilePic: user.picture || undefined,
        },
      });
    } catch (error) {
      console.error('Error upserting user:', error);
    }
  }

  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
