"use client";

import Image from "next/image";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/CookieConsent";
import { 
  DEFAULT_SOCIALS, 
  DEFAULT_LINKS, 
  FOOTER_ASSETS, 
  FOOTER_OFFICE_INFO, 
  FOOTER_TEXT_CONTENT,
  SocialLink,
  FooterStaticLink
} from "@/constants/footerMainConstants";

interface FooterProps {
  logo?: string;
  title?: string;
  ukOffice?: string | React.ReactNode;
  irelandOffice?: string | React.ReactNode;
  copyright?: string;
  socialLinks?: SocialLink[];
  footerLinks?: FooterStaticLink[];
}

export default function Footer({
  logo,
  title,
  copyright,
  socialLinks,
  footerLinks,
}: FooterProps) {
  // Use Puck runtime data if available, otherwise fallback to static configuration definitions
  const activeSocials = socialLinks || DEFAULT_SOCIALS;
  const activeLinks = footerLinks || DEFAULT_LINKS;
  const activeLogo = logo || FOOTER_ASSETS.fallbackLogo;

  return (
    <footer id="Contact" className="bg-[#07004C] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row gap-2 items-start text-center md:text-left">
          
          {/* Left Column - Offices */}
          <div className="w-full flex md:w-[20%] justify-center md:justify-start">
            <div>
              <h3 className="text-links mb-3">{title}</h3>
              <div className="text-footer leading-6">
                <h3 className="font-lexendBold text-[18px]">{FOOTER_OFFICE_INFO.phoneLabel}</h3>
                <p className="font-lexend text-[15px]">{FOOTER_OFFICE_INFO.phoneValue}</p>
                <br/>
                <h3 className="font-lexendBold text-[18px]">{FOOTER_OFFICE_INFO.emailLabel}</h3>
                <p className="font-lexend text-[15px]">{FOOTER_OFFICE_INFO.emailValue}</p>
                <br/>
                <h3 className="font-lexendBold text-[18px]">{FOOTER_OFFICE_INFO.headOfficeLabel}</h3>
                <p className="font-lexend text-[15px]">
                  {FOOTER_OFFICE_INFO.headOfficeAddressLine1} <br/>
                  {FOOTER_OFFICE_INFO.headOfficeAddressLine2} <br/>
                  {FOOTER_OFFICE_INFO.headOfficeAddressLine3}
                </p>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="w-full flex md:w-[55%] flex-col items-center">
            <Link href="/">
              <Image
                src={activeLogo}
                width={180}
                height={80}
                alt="Muve Healthcare"
              />
            </Link>
            <p className="mt-6 text-links text-center whitespace-pre-line">
              {copyright || FOOTER_TEXT_CONTENT.fallbackCopyright}
            </p>
          </div>

          {/* Right Column - Links + Preference Buttons */}
          <div className="w-full flex md:w-[20%] flex-col items-center md:items-start gap-6">
            <div className="text-sm space-y-2 flex flex-col">
              {activeLinks.map((link: FooterStaticLink, i: number) => (
                <Link
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-links hover:text-lightblue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-sm mt-2">
              <CookiePreferencesButton />
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="w-full flex md:w-[5%] flex-col items-center">
            {activeSocials.map((social: SocialLink, i: number) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:text-lightblue transition-colors"
                aria-label={`Visit Muve Healthcare on ${social.name}`}
              >
                <img
                  src={`/icons/footer/${social.name}.svg`}
                  className="w-7"
                  alt={social.name}
                />
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
