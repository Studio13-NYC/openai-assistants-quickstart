import { Inter } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import NavBar from "./components/nav-bar";
import { assistantId } from "./assistant-config";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Assistants API Quickstart",
  description: "A quickstart template using the Assistants API with OpenAI",
  icons: {
    icon: "/openai.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {assistantId ? (
          <>
            <NavBar />
            <div className="page-container">
              {children}
            </div>
          </>
        ) : (
          <Warnings />
        )}
        <img className="logo" src="/openai.svg" alt="OpenAI Logo" />
      </body>
    </html>
  );
}
