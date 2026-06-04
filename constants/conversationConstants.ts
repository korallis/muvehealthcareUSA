export interface LinkObject {
  name: string;
  customPath: string;
}

export type FooterLink = string | LinkObject;

export interface FooterColumn {
  title: string;
  path?: string;
  links: FooterLink[];
}

export const CONVERSATION_DATA = {
  subtitle: "Speak with a team member",
  disclaimer: "We will send you news and updates, T+C’s apply*",
  whatsappUrl: "https://www.cognitoforms.com/ICare24Group1/MuveCallBackForm",
  callbackUrl: "https://www.cognitoforms.com/ICare24Group1/EmailAndSMSSubscriptionConsentForm",
  subscribeUrl: "https://www.cognitoforms.com/ICare24Group1/EmailSubscriptionConsentForm",
};

export const FOOTER_QUICK_LINKS: FooterColumn[] = [
  {
    title: "About",
    links: [
      { name: "Who we are", customPath: "#who-we-are" },
      { name: "Work With Us", customPath: "#work-with-us" },
      { name: "Our Specialities", customPath: "#specialities" }
    ],
  },
  {
    title: "Work With Us",
    links: [
      { name: "Our Careers", customPath: "#work-with-us" },
      { name: "Make a Referal", customPath: "ApplicationForm" },
      { name: "Why Choose Us", customPath: "#for-professionals-and-clients" }
    ],
  },
  {
    title: "Hire Team",
    links: [
      { name: "Our Specialities", customPath: "#specialities" },
      { name: "Get In Touch", customPath: "#get-in-touch" },
      { name: "Why Choose Us", customPath: "#for-professionals-and-clients" }
    ],
  },
  {
    title: "Resourses",
    path: "/resources",
    links: [
      { name: "FAQ's", customPath: "/privacy" },
      "Latest News", 
      "Downloads"
    ],
  },
  {
    title: "Get in Touch",
    path: "/Contact",
    links: [
      { name: "Apply", customPath: "ApplicationForm" },
      { name: "Contact", customPath: "#Contact" },
      { name: "Make a Referal", customPath: "ApplicationForm" }
    ],
  },
];
