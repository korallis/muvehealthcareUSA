export const DEFAULT_NAV_PROPS = {
  logo: "/muve-logo.png",
  links: [
    {
      title: "About",
      href: "/about",
      dropdownBg: "bg-[#07004C]",
      textColor: "text-white",
      subLinks: [
        { title: "Who we are", href: "#who-we-are" },
        { title: "Work With Us", href: "/about#who-we-help" },
        { title: "Our Socialites", href: "/about#how-we-do-it" },
      ],
    },
    {
      title: "Work With Us",
      href: "/workwithus",
      dropdownBg: "bg-[#4C86FF]",
      textColor: "text-white",
      subLinks: [
        { title: "Our Careers", href: "/services#supported-living" },
        { title: "Make a Referral", href: "/services#residential-care" },
        { title: "Why Choose Us", href: "/services#community-care" },
      ],
    },
    {
      title: "Hire Team",
      href: "/hireteam",
      dropdownBg: "bg-[#28536B]",
      textColor: "text-white",
      subLinks: [
        { title: "Our Specialties", href: "/stories#social-value" },
        { title: "Get in Touch", href: "/stories#impact-stories" },
        { title: "Why Choose Us", href: "/stories#events" },
      ],
    },
    {
      title: "Resources",
      href: "/resources",
      dropdownBg: "bg-[#40E2B8]",
      textColor: "text-white",
      subLinks: [
        { title: "FAQ’s", href: "/resources#fAQs" },
        { title: "Quick Links", href: "/resources#quick-links" },
        { title: "Latest News", href: "/resources#latest-news" },
        { title: "Privacy Policy", href: "/resources#privacy-policy" },
      ],
    },
    {
      title: "Get in Touch",
      href: "/Contact",
      dropdownBg: "bg-[#688797]",
      textColor: "text-white",
      subLinks: [
        { title: "Apply", href: "/contact" },
        { title: "Contact", href: "/contact#locations" },
        { title: "Make a Referral", href: "/contact#feedback-form" },
      ],
    },
  ],
};
