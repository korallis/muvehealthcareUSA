export const DEFAULT_NAV_PROPS = {
  logo: "/muve-logo.png",
  links: [
    {
      title: "About",
      href: "/about",
      dropdownBg: "bg-[#24345E]",
      textColor: "text-white",
      subLinks: [
        { title: "Who we are", href: "/about#who-we-are" },
        { title: "Who we help", href: "/about#who-we-help" },
        { title: "How we do it", href: "/about#how-we-do-it" },
      ],
    },
    {
      title: "Services",
      href: "/services",
      dropdownBg: "bg-[#00D9DA]",
      textColor: "text-navyblue",
      subLinks: [
        { title: "Supported Living", href: "/services#supported-living" },
        { title: "Residential Care", href: "/services#residential-care" },
        { title: "Community Care", href: "/services#community-care" },
        { title: "Mental Health", href: "/services#independent-mental-health" },
        { title: "Children’s Services", href: "/services#childrens-services" },
      ],
    },
    {
      title: "Resources",
      href: "/resources",
      dropdownBg: "bg-[#918CF2]",
      textColor: "text-white",
      subLinks: [
        { title: "FAQ’s", href: "/resources#fAQs" },
        { title: "Quick Links", href: "/resources#quick-links" },
        { title: "Latest News", href: "/resources#latest-news" },
        { title: "Privacy Policy", href: "/resources#privacy-policy" },
      ],
    },
    {
      title: "Stories+Impact",
      href: "/stories",
      dropdownBg: "bg-[#4056E3]",
      textColor: "text-white",
      subLinks: [
        { title: "Social Value", href: "/stories#social-value" },
        { title: "Impact Stories", href: "/stories#impact-stories" },
        { title: "Events", href: "/stories#events" },
      ],
    },
    {
      title: "Get in Touch",
      href: "/Contact",
      dropdownBg: "bg-[#B2AEF6]",
      textColor: "text-white",
      subLinks: [
        { title: "Contact Us", href: "/contact" },
        { title: "Locations", href: "/contact#locations" },
        { title: "Feedback Form", href: "/contact#feedback-form" },
        { title: "Careers", href: "/contact#careers" },
      ],
    },
  ],
};
