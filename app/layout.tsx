import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import LocalFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { getPageDataAction } from "@/lib/actions/editor";
import { DEFAULT_NAV_PROPS } from "@/constants/nav-defaults";

const monts = Montserrat({
  weight: ["400", "200"],
  variable: "--font-montserrat",
});
const lexendDeca = LocalFont({
  src: [{ path: "../public/fonts/LexendDeca-Bold.ttf" }],
  variable: "--font-lexendDeca",
});

export const metadata: Metadata = {
  title: "Muve",
  description: "Redefining healthcare",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let navProps = DEFAULT_NAV_PROPS;
  let footerProps = {}; // 1. Create a variable for footer data

  try {
    const globalData = await getPageDataAction("global-settings");

    // Find the Navbar item
    const navItem = globalData?.content?.find(
      (item: { type: string; props?: Record<string, unknown> }) =>
        item.type === "Navbar",
    );
    if (navItem?.props) {
      navProps = navItem.props;
    }

    // 2. Find the Footer item in your global settings
    const footerItem = globalData?.content?.find(
      (item: { type: string; props?: Record<string, unknown> }) =>
        item.type === "Footer",
    );
    if (footerItem?.props) {
      footerProps = footerItem.props;
    }
  } catch (e) {
    console.error("Global settings fetch failed.");
  }

  return (
    <html lang="en">
      <body className={`${lexendDeca.variable} ${monts.variable} antialiased`}>
        <Navbar {...navProps} />
        {children}
        <AccessibilityWidget />
        {/* 3. Pass the dynamic props to the Footer */}
        {/* <Footer {...footerProps} /> */}
      </body>
    </html>
  );
}

