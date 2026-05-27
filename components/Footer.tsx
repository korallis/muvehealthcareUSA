import Image from "next/image";
import Link from "next/link";
import { sanitizeHTML } from "@/lib/sanitize";
import { CookiePreferencesButton } from "@/components/CookieConsent";

interface SocialLink {
  name: string;
  url: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  logo?: string;
  title?: string;
  ukOffice?: string | React.ReactNode;
  irelandOffice?: string | React.ReactNode;
  copyright?: string;
  socialLinks?: SocialLink[];
  footerLinks?: FooterLink[];
}

// Define the props so it can receive data from Puck or stay static
export default function Footer({
  logo,
  title,
  ukOffice,
  irelandOffice,
  copyright,
  socialLinks,
  footerLinks,
}: FooterProps) {
  // 1. Fallback data (Your original static data)
  const defaultSocials = [
    {
      name: "Linkedin",
      url: "https://www.linkedin.com/company/muvehealthcare-usa/",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/muvehealthcare_usa/",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/muvehealthcare/",
    },
  ];

  const defaultLinks = [
    { label: "Modern Slavery", href: "/Slavery" },
    { label: "Privacy Policy", href: "/Privacy" },
    { label: "Handbook", href: "/cookies" },
    { label: "CQC Report", href: "https://www.cqc.org.uk" },
    { label: "Terms + Conditions", href: "/Terms" },
    {
      label: "Revoke consents",
      href: "https://www.cognitoforms.com/ICare24Group1/ConsentWithdrawalForm",
    },
  ];

  // 2. Use Puck data if available, otherwise use static defaults
  const activeSocials = socialLinks || defaultSocials;
  const activeLinks = footerLinks || defaultLinks;
  const activeLogo = logo || "/muveusalogo.svg";

  return (
    <footer id="Contact" className="bg-[#07004C] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
          {/* Left Column - Offices */}
          <div className="flex justify-center md:justify-start">
            <div>
              <h3 className="text-links mb-3">{title}</h3>
              <div className="text-footer leading-6">
                {/* Use Puck rich text or static fallback */}
                {/* {ukOffice ? (
                  typeof ukOffice === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(ukOffice),
                      }}
                    />
                  ) : (
                    ukOffice
                  )
                ) : (
                 
                  <p>
                    Suite 1<br />
                    Aqueous II
                    <br />
                    Rocky Lane
                    <br />
                    Birmingham
                    <br />
                    B6 5RQ
                  </p>
                )} */}
                <h3 className="font-lexendBold text-[18px]">Phone</h3>
                <p className="font-lexend text-[15px]">1866-467-1912</p>
                <br/>
                <h3 className="font-lexendBold text-[18px]">Email</h3>
                <p className="font-lexend text-[15px]">Accountmgmt@muvehealthcare.com</p>
                <br/>
                <h3 className="font-lexendBold text-[18px]">Head Office</h3>
                <p className="font-lexend text-[15px]">
                  2600 South Shore Blvd. <br/>
                  Suite 300, League City, <br/>
                  TX 77573
                  </p>
              </div>
            </div>

            {/* <div>
              <h3 className="text-links mb-3">Manchester Office</h3>
              <div className="text-footer leading-6">
                {irelandOffice ? (
                  typeof irelandOffice === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(irelandOffice),
                      }}
                    />
                  ) : (
                    irelandOffice
                  )
                ) : (
                  <p>
                    Third Floor
                    <br />
                    8/9 Westmoreland
                    <br />
                    Street
                    <br />
                    Dublin
                    <br />
                    D02 Y889
                  </p>
                )}
              </div>
            </div> */}
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <Link href="/">
              <Image
                src={activeLogo}
                width={180}
                height={80}
                alt="Muve Healthcare"
              />
            </Link>
            <p className="mt-6 text-links text-center whitespace-pre-line">
              {copyright ||
                "© 2026 Muve Healthcare USA.\nAll Rights Reserved. Site by Marva Group."}
            </p>
          </div>

          {/* Right Column - Links + Social Icons */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="text-sm space-y-2 flex flex-col">
              {activeLinks.map((link: FooterLink, i: number) => (
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

            <div className="flex gap-4 mt-2">
              {activeSocials.map((social: SocialLink, i: number) => (
                <a
                  key={i} // Use the index 'i' instead of 'social.name'
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
      </div>
    </footer>
  );
}
