export interface ProfessionalBenefit {
  title: string;
  description: string;
}

export interface CardContentConfig {
  fallbackTitleMain: string;
  fallbackTitleSpan: string;
  benefits: ProfessionalBenefit[];
  btnText: string;
  btnHref: string;
}

export const PROFESSIONALS_ASSETS = {
  bgImageSrc: "/patterns/background.svg",
};

export const PROFESSIONALS_CARD_DATA: CardContentConfig = {
  fallbackTitleMain: "For",
  fallbackTitleSpan: "Professionals",
  benefits: [
    {
      title: "24/7 Support",
      description: "Call, email or message anytime. We’re always here to help."
    },
    {
      title: "Fast, Simple Applications",
      description: "Apply from your phone with smooth onboarding and dedicated support."
    },
    {
      title: "Training Support",
      description: "We help with certifications, licensing and compliance at no cost."
    }
  ],
  btnText: "Find Your Role",
  btnHref: "ApplicationForm"
};

export const CLIENTS_CARD_DATA: CardContentConfig = {
  fallbackTitleMain: "For",
  fallbackTitleSpan: "Clients",
  benefits: [
    {
      title: "Strong Talent Network",
      description: "Access skilled nurses, allied professionals and physicians across all specialties."
    },
    {
      title: "The Right Fit",
      description: "We place trained, vetted professionals ready to deliver quality care."
    },
    {
      title: "24/7 Staffing Support",
      description: "Get reliable support and active solutions whenever your facility needs coverage."
    }
  ],
  btnText: "Hire Talent",
  btnHref: "#Contact"
};
