export interface SocialLink {
  name: string;
  url: string;
}

export interface FooterStaticLink {
  label: string;
  href: string;
}

export const DEFAULT_SOCIALS: SocialLink[] = [
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

export const DEFAULT_LINKS: FooterStaticLink[] = [
  { label: "Modern Slavery", href: "/Slavery" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Handbook", href: "/cookies" },
  { label: "Terms + Conditions", href: "/Terms" },
  {
    label: "Revoke consents",
    href: "https://www.cognitoforms.com/ICare24Group1/ConsentWithdrawalForm",
  },
];

export const FOOTER_ASSETS = {
  fallbackLogo: "/muveusalogo.svg"
};

export const FOOTER_OFFICE_INFO = {
  phoneLabel: "Phone",
  phoneValue: "1866-467-1912",
  emailLabel: "Email",
  emailValue: "Accountmgmt@muvehealthcare.com",
  headOfficeLabel: "Head Office",
  headOfficeAddressLine1: "2600 South Shore Blvd.",
  headOfficeAddressLine2: "Suite 300, League City,",
  headOfficeAddressLine3: "TX 77573"
};

export const FOOTER_TEXT_CONTENT = {
  fallbackCopyright: "© 2026 Muve Healthcare USA.\nAll Rights Reserved. Site by Marva Group."
};
