"use client";
import { Config, Slot } from "@puckeditor/core";
import { DEFAULT_NAV_PROPS } from "@/constants/nav-defaults";
import Link from "next/link";
import { sanitizeHTML } from "@/lib/sanitize";
import type { NavLink } from "@/types/index";

// 1. NATIVE RICH TEXT DECLARATION (Required for Puck 0.21+)
declare module "@puckeditor/core" {
  export interface DefaultFieldTypes {
    richtext: {
      type: "richtext";
      contentEditable?: boolean;
    };
  }
}

// --- COMPONENT IMPORTS ---
import Navbar from "@/components/Navbar";
import Hero from "@/components/Home/Hero";
import Path from "@/components/Home/PathCare";
import Professionals from "./components/Home/Professionals";
import Specialities from "./components/Home/Specialists";
// import WorkWithUs from "./components/Home/Workwithus";
import WorkWithUsToo from "./components/Home/Workwithus";

import FooterSection from "@/components/Home/Conversation";

import FrequentlyAsked from "./components/Faq/FrequentlyAsked";
import QuickLinks from "./components/Faq/QuickLinks";
import LatestNewsUI from "./components/Faq/LatestNews/LatestNewsUI";
import Social, { SocialProps } from "./components/Social/Value";
import EventsUI from "./components/Social/Events/EventsUI";
import FeedbackForm from "./components/GetInTouch/Feedback";


import PuckImageField from "@/components/dashboard/PuckImageField";
import { ImageIcon } from "lucide-react";
import ImageUpload from "./components/dashboard/ImageUpload";

// --- 3. REUSABLE ELEMENTOR-STYLE FIELDS ---
const stylingFields = {
  paddingTop: { type: "number", label: "Padding Top (px)" },
  paddingBottom: { type: "number", label: "Padding Bottom (px)" },
  marginTop: { type: "number", label: "Margin Top (px)" },
  marginBottom: { type: "number", label: "Margin Bottom (px)" },
  borderRadius: { type: "number", label: "Corner Radius (px)" },
  zIndex: { type: "number", label: "Z-Index" },
} as const;

const getStyles = (props: Record<string, unknown>) => ({
  paddingTop: props.paddingTop ? `${props.paddingTop}px` : undefined,
  paddingBottom: props.paddingBottom ? `${props.paddingBottom}px` : undefined,
  marginTop: props.marginTop ? `${props.marginTop}px` : undefined,
  marginBottom: props.marginBottom ? `${props.marginBottom}px` : undefined,
  borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
  zIndex: (props.zIndex as number) || undefined,
});

// --- BRAND OPTIONS ---
const brandColorOptions = [
  { label: "Muve Purple", value: "bg-purple" },
  { label: "Muve Light Blue", value: "bg-lightblue" },
  { label: "Muve Navy", value: "bg-navyblue" },
  { label: "Muve Fade Purple", value: "bg-fadedpurple" },
  { label: "White", value: "bg-white" },
  { label: "Transparent", value: "bg-transparent" },
  { label: "Muve Living", value: "bg-muvelivingcolor" },
  { label: "Muve Horizons", value: "bg-muvehorizonscolor" },
  { label: "Muve Community", value: "bg-muvecommunitycolor" },
  { label: "Muve Minds", value: "bg-muvemindscolor" },
  { label: "Muve Bright", value: "bg-muvebrightcolor" },
];

const dropdownBgOptions = [
  { label: "Navy (#24345E)", value: "bg-[#24345E]" },
  { label: "Light Blue (#00D9DA)", value: "bg-[#00D9DA]" },
  { label: "Purple (#918CF2)", value: "bg-[#918CF2]" },
  { label: "Blue (#4056E3)", value: "bg-[#4056E3]" },
  { label: "Lavender (#B2AEF6)", value: "bg-[#B2AEF6]" },
];

const brandFontOptions = [
  { label: "Lexend Regular", value: "font-lexend" },
  { label: "Lexend Bold", value: "font-lexendBold" },
];

const brandTextColors = [
  { label: "Navy Blue", value: "text-navyblue" },
  { label: "White", value: "text-white" },
  { label: "Light Blue", value: "text-lightblue" },
  { label: "Purple", value: "text-purple" },
];

// --- TYPES ---
type Props = {
  Navbar: { logo?: string; links?: NavLink[] };
  Hero: { title?: string; subtitle?: string; bgColor?: string };
  Path: { title?: string };
  Professionals: { title?: string };
  Specialities: { title?: string };
  WorkWithUsToo: { title?: string };
  FrequentlyAsked: { title?: string };
  QuickLinks: { title?: string };
  LatestNews: { title?: string };
  Social: SocialProps;
  Events: { title?: string };
  FeedbackForm: { title?: string };

  FooterSection: { copyright?: string };

  // Page Builder (Elementor-style)
  Section: {
    items: Slot;
    bgColor: string;
    fullWidth: string;
    paddingTop?: number;
    paddingBottom?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    zIndex?: number;
  };
  Columns: { left: Slot; right: Slot; distribution?: string };
  Heading: {
    text: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    color?: string;
    align: string;
    paddingTop?: number;
    paddingBottom?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    zIndex?: number;
  };
  TextBlock: {
    text: string;
    fontFamily: string;
    fontSize: string;
    color: string;
    highlight: string;
    align: "left" | "center";
  };
  Button: {
    label: string;
    href: string;
    variant: string;
    align: string;
    paddingTop?: number;
    paddingBottom?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    zIndex?: number;
  };
  Spacer: { height: number };
  Image: {
    src: string;
    alt: string;
    width?: string;
    paddingTop?: number;
    paddingBottom?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    zIndex?: number;
  };

  // Policies Props
  PolicyList: {
    title: string;
    policies: {
      heading: string;
      content: string;
    }[];
  };

  // Footer Props
  Footer: {
    logo: string;
    title: string;
    ukOffice: string | React.ReactNode;
    irelandOffice: string | React.ReactNode;
    copyright: string;
    socialLinks: { name: string; url: string }[];
    footerLinks: { label: string; href: string }[];
  };
};

// --- CONFIG ---
export const config: Config<Props> = {
  categories: {
    Layout: {
      components: ["Section", "Columns", "Spacer"],
      defaultExpanded: true,
    },
    Basic: { components: ["Heading", "TextBlock", "Image", "Button"] },
    Global: {
      components: ["Navbar", "FooterSection", "Footer"],
      defaultExpanded: false,
    },
    Home: {
      components: ["Hero", "Path",],
      defaultExpanded: false,
    },
    Resources: {
      components: ["FrequentlyAsked", "QuickLinks", "LatestNews"],
      defaultExpanded: false,
    },

    Contact: {
      components: ["FeedbackForm"],
      defaultExpanded: false,
    },
    legal: {
      components: ["PolicyList"],
      title: "Legal Pages",
    },
  },

  components: {
    Navbar: {
      fields: {
        logo: {
          type: "custom",
          render: ({ onChange, value }) => (
            <PuckImageField
              onChange={onChange}
              value={value}
              previewClassName="h-8 object-contain"
            />
          ),
        },
        links: {
          type: "array",
          getItemSummary: (item) => item.title || "New Link",
          arrayFields: {
            title: { type: "text" },
            href: { type: "text" },
            dropdownBg: { type: "select", options: dropdownBgOptions },
            textColor: {
              type: "radio",
              options: [
                { label: "White", value: "text-white" },
                { label: "Navy", value: "text-navyblue" },
              ],
            },
            subLinks: {
              type: "array",
              getItemSummary: (item) => item.title || "Sub Link",
              arrayFields: {
                title: { type: "text" },
                href: { type: "text" },
              },
            },
          },
        },
      },
      // Ensure these are correctly set
      defaultProps: DEFAULT_NAV_PROPS,
      inline: true,
      render: ({ puck, ...props }) => (
        <Navbar {...(props as Record<string, unknown>)} puck={puck} />
      ),
    },

    Hero: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        bgColor: {
          type: "select",
          label: "Background",
          options: brandColorOptions,
        },
      },
      render: (props) => <Hero {...props} />,
    },

    // --- NEW PAGE BUILDER COMPONENTS ---
    Section: {
      fields: {
        items: { type: "slot" },
        bgColor: { type: "select", options: brandColorOptions },
        fullWidth: {
          type: "radio",
          options: [
            { label: "Fixed", value: "false" },
            { label: "Full Width", value: "true" },
          ],
        },
        ...stylingFields,
      },
      defaultProps: {
        items: [],
        bgColor: "bg-white",
        paddingTop: 64,
        paddingBottom: 64,
        fullWidth: "false", // Set a default string value
      },
      render: ({ items: Items, bgColor, fullWidth, ...props }) => (
        <section className={bgColor} style={getStyles(props)}>
          <div
            className={
              fullWidth === "true" ? "w-full" : "max-w-7xl mx-auto px-6"
            }
          >
            <Items />
          </div>
        </section>
      ),
    },

    Spacer: {
      fields: { height: { type: "number" } },
      defaultProps: { height: 40 },
      render: ({ height }) => <div style={{ height: `${height}px` }} />,
    },

    // --- CONTENT COMPONENTS ---
    Heading: {
      fields: {
        text: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "text-left" },
            { label: "Center", value: "text-center" },
          ],
        },
        color: {
          type: "select",
          options: [
            { label: "Navy", value: "text-navyblue" },
            { label: "White", value: "text-white" },
          ],
        },
        ...stylingFields,
      },
      defaultProps: {
        text: "Click to edit heading",
        level: "h2",
        align: "text-left",
      },
      render: ({ text, level, align, color, ...props }) => {
        const Tag = level as React.ElementType;
        const baseClass =
          level === "h1"
            ? "text-4xl font-lexendBold"
            : "text-3xl font-lexendBold";
        return (
          <Tag
            className={`${baseClass} ${align} ${color}`}
            style={getStyles(props)}
          >
            {text}
          </Tag>
        );
      },
    },

    TextBlock: {
      fields: {
        // 1. Use richtext for bullets and bolding
        text: {
          type: "richtext",
          contentEditable: true,
        },
        // 2. Keep your consistent sidebar fields
        fontFamily: {
          type: "select",
          options: [
            { label: "Lexend", value: "font-lexend" },
            { label: "Lexend Bold", value: "font-lexendBold" },
          ],
        },
        fontSize: {
          type: "select",
          options: [
            { label: "Small", value: "text-sm" },
            { label: "Base", value: "text-base" },
            { label: "Large", value: "text-lg" },
            { label: "Extra Large", value: "text-xl" },
          ],
        },
        color: {
          type: "select",
          options: [
            { label: "Navy", value: "#000080" }, // Use hex for direct style application
            { label: "White", value: "#ffffff" },
          ],
        },
        highlight: {
          type: "select",
          options: [
            { label: "None", value: "transparent" },
            { label: "Puck Highlight", value: "#FBAD1A" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
      },
      defaultProps: {
        text: "<p>Edit this text...</p>",
        fontFamily: "font-lexend",
        fontSize: "text-base",
        color: "#000080",
        highlight: "transparent",
        align: "left",
      },
      render: ({ text, fontFamily, fontSize, color, highlight, align }) => {
        return (
          <div
            className={`${fontFamily} ${fontSize} prose prose-slate max-w-none`}
            style={{
              color: color,
              backgroundColor: highlight,
              textAlign: align as React.CSSProperties["textAlign"],
            }}
          >
            {text}
          </div>
        );
      },
    },

    Image: {
      fields: {
        src: {
          type: "custom",
          render: ({ onChange, value }) => (
            <PuckImageField onChange={onChange} value={value} />
          ),
        },
        alt: { type: "text" },
        ...stylingFields,
      },
      render: ({ src, alt, ...props }) => (
        <div style={getStyles(props)} className="overflow-hidden">
          <img
            src={src || "/placeholder.jpg"}
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
      ),
    },

    Button: {
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "justify-start" },
            { label: "Center", value: "justify-center" },
          ],
        },
        variant: {
          type: "select",
          options: [
            { label: "Solid Navy", value: "bg-navyblue text-white" },
            { label: "Light Blue", value: "bg-lightblue text-navyblue" },
          ],
        },
        ...stylingFields,
      },
      render: ({ label, href, align, variant, ...props }) => (
        <div className={`flex ${align}`} style={getStyles(props)}>
          <a
            href={href}
            className={`px-8 py-3 rounded-full font-lexendBold transition-transform hover:scale-105 ${variant}`}
          >
            {label}
          </a>
        </div>
      ),
    },

    Columns: {
      fields: {
        left: { type: "slot" },
        right: { type: "slot" },
        distribution: {
          type: "select",
          options: [
            { label: "50/50", value: "grid-cols-1 md:grid-cols-2" },
            { label: "60/40", value: "grid-cols-1 md:grid-cols-[1.5fr_1fr]" },
            { label: "40/60", value: "grid-cols-1 md:grid-cols-[1fr_1.5fr]" },
          ],
        },
      },
      defaultProps: {
        left: [],
        right: [],
        distribution: "grid-cols-1 md:grid-cols-2",
      },
      render: ({ left: Left, right: Right, distribution }) => (
        <div className={`grid gap-8 md:gap-12 ${distribution}`}>
          <div>
            <Left />
          </div>
          <div>
            <Right />
          </div>
        </div>
      ),
    },

    Bobby: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        name: { type: "text" },
        role: { type: "text" },
        experience: { type: "textarea" },
        education: { type: "textarea" },
        funFact: { type: "textarea" },
        bgColor: {
          type: "select",
          label: "Background Color",
          options: brandColorOptions,
        },
        fontFamily: {
          type: "select",
          label: "Font Family",
          options: brandFontOptions,
        },
        textColor: {
          type: "select",
          label: "Text Color",
          options: brandTextColors,
        },
        image: {
          type: "custom",
          render: ({ onChange, value }) => (
            <div className="space-y-2 py-2">
              {/* Label and Icon */}
              <label className="text-sm font-bold text-[#1F3154] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={14} /> Featured Image
              </label>
              
              {/* Hint Text */}
              <p className="text-gray-400 text-xs">
                Recommended: 1200x630px
              </p>
              
              <ImageUpload 
                value={value ?? ""} 
                onChange={(newValue) => onChange(newValue)} 
              />
            </div>
          ),
        },

      },
      render: (props) => <Bobby {...props} />,
    },

    Path: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <Path title={title} />,
    },
    Professionals: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <Professionals title={title} />,
    },
    Specialities: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <Specialities title={title} />,
    },
    WorkWithUsToo: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <WorkWithUsToo title={title} />,
    },
    Mission: {
      fields: { title: { type: "text" }, description: { type: "textarea" } },
      render: ({ title, description }) => (
        <MissionSection title={title} description={description} />
      ),
    },
    HowWeHelp: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <HowWeHelp title={title} />,
    },
    WhoWeAre: {
      fields: {
        title: { type: "text" },
        subtitleWho: { type: "text" },
        subtitleAre: { type: "text" },
        introText: { type: "textarea" },
        mainBody: { type: "textarea" },
        buttonText: { type: "text" },
        buttonPath: { type: "text" },
        image: {
          type: "custom",
          render: ({ onChange, value }) => (
            <PuckImageField onChange={onChange} value={value} />
          ),
        },
      },
      defaultProps: {
        title: "About",
        subtitleWho: "Who",
        subtitleAre: "We Are?",
        introText:
          "MUVE Healthcare Group exists to make quality care human, accessible, and empowering.",
        mainBody:
          "We bring together specialist services, from supported living and residential care to community, mental health, and children’s services...",
        buttonText: "Meet The Team",
        buttonPath: "/team",
        image: "/Section_ImageRight.png",
      },
      render: (props) => <WhoWeAre {...props} />,
    },


    // Faq Pages
    FrequentlyAsked: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <FrequentlyAsked title={title} />,
    },
    QuickLinks: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <QuickLinks title={title} />,
    },
    LatestNews: { render: () => <LatestNewsUI /> },
    // Social: { fields: { title: { type: "text" } }, render: ({ title }) => <Social title={title} /> },
    Social: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        // This 'cards' key connects to the cards array in your component
        cards: {
          type: "array",
          getItemSummary: (item) => item.title || "New Card",
          arrayFields: {
            num: {
              type: "text",
              label: "Card Number (e.g. 1)",
            },
            title: {
              type: "text",
              label: "Card Header",
            },
            desc: {
              type: "textarea",
              label: "Card Description",
            },
          },
        },
        buttonText: { type: "text" },
        buttonLink: { type: "text" },
        visionText: { type: "textarea" },
        directorName: { type: "text" },
        directorRole: { type: "text" },
      },
      render: (props) => <Social {...props} />,
    },

    Events: { fields: { title: { type: "text" } }, render: () => <EventsUI /> },

    FeedbackForm: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <FeedbackForm title={title} />,
    },

    FooterSection: {
      fields: { copyright: { type: "text" } },
      render: ({ copyright }) => <FooterSection copyright={copyright} />,
    },

    // Privacy Policies
    PolicyList: {
      fields: {
        title: {
          type: "text",
          contentEditable: true,
        },
        policies: {
          type: "array",
          getItemSummary: (item, i) =>
            (item.heading as string) || `Policy ${(i ?? 0) + 1}`,
          defaultItemProps: {
            heading: "New Section Title",
            content: "<p>Enter detailed policy text here...</p>",
          },
          // IMPORTANT: In 2026, use arrayFields instead of fields inside arrays
          arrayFields: {
            heading: {
              type: "text",
              contentEditable: true,
            },
            content: {
              type: "richtext",
              contentEditable: true,
            },
          },
        },
      },
      defaultProps: {
        title: "Privacy Policy",
        policies: [
          {
            heading: "1. Introduction",
            content: "<p>MUVE Healthcare Group is committed...</p>",
          },
        ],
      },
      render: ({ title, policies }) => {
        return (
          <main className="w-full bg-purple min-h-screen">
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-6 text-white">
                <h1 className="font-lexendBold text-5xl md:text-6xl mb-12">
                  {title}
                </h1>

                <div className="space-y-12 max-w-4xl">
                  {policies.map((policy, i) => (
                    <section key={i} className="policy-section">
                      <h3 className="font-lexendBold text-lg mb-4 mt-6 text-white">
                        {policy.heading}
                      </h3>

                      {/* 
                          THE FIX: Explicitly force bullets and padding.
                          - 'prose-ul:list-disc': Force bullet type
                          - 'prose-ul:pl-5': Re-add the padding Tailwind removed
                          - 'marker:text-white': Ensure the bullet itself is white
                        */}
                      <div className="font-lexend prose prose-invert prose-slate max-w-none text-white/90">
                        {typeof policy.content === "string" ? (
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: content sanitized via sanitizeHTML
                          <div
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHTML(policy.content),
                            }}
                          />
                        ) : (
                          policy.content
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </section>
          </main>
        );
      },
    },

    // --- FOOTER COMPONENT ---
    Footer: {
      fields: {
        logo: {
          type: "custom",
          render: ({ onChange, value }) => (
            <PuckImageField
              onChange={onChange}
              value={value}
              previewClassName="h-8 object-contain"
            />
          ),
        },
        title: { type: "text" },
        ukOffice: { type: "richtext", contentEditable: true },
        irelandOffice: { type: "richtext", contentEditable: true },
        copyright: { type: "text" },
        footerLinks: {
          type: "array",
          getItemSummary: (item) => item.label || "Link",
          arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
          },
        },
        socialLinks: {
          type: "array",
          getItemSummary: (item) => item.name || "Social",
          arrayFields: {
            name: { type: "text" },
            url: { type: "text" },
          },
        },
      },
      defaultProps: {
        logo: "/muve-logo.png",
        title: "UK Offices",
        ukOffice: "Suite 1<br />Aqueous II<br />Birmingham<br />B6 5RQ",
        irelandOffice:
          "Third Floor<br />8/9 Westmoreland<br />Dublin<br />D02 Y889",
        copyright:
          "© 2025 Muve Healthcare Group.\nAll Rights Reserved. Site by Marva Group.",
        footerLinks: [
          { label: "Modern Slavery", href: "/Slavery" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "CQC Report", href: "https://www.cqc.org.uk" },
          { label: "Terms + Conditions", href: "/Term" },
          {
            label: "Revoke Consent",
            href: "https://www.cognitoforms.com/ICare24Group1/ConsentWithdrawalForm",
          },
        ],
        socialLinks: [
          {
            name: "Linkedin",
            url: "https://www.linkedin.com/company/muve-healthcare/",
          },
          {
            name: "Instagram",
            url: "https://www.instagram.com/muvehealthcaregroup/",
          },
          { name: "Facebook", url: "https://www.facebook.com" },
        ],
      },
      render: ({
        logo,
        title,
        ukOffice,
        irelandOffice,
        copyright,
        socialLinks,
        footerLinks,
      }) => {
        return (
          <footer className="bg-[#24345E] text-white py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
                {/* Office Columns */}
                <div className="flex justify-center md:justify-start gap-16">
                  <div>
                    <h3 className="text-links mb-3 font-lexendBold">
                      UK Office
                    </h3>
                    <div className="text-footer leading-6">
                      {typeof ukOffice === "string" ? (
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: content sanitized via sanitizeHTML
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(ukOffice),
                          }}
                        />
                      ) : (
                        ukOffice
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-links mb-3 font-lexendBold">
                      Ireland Office
                    </h3>
                    <div className="text-footer leading-6">
                      {typeof irelandOffice === "string" ? (
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: content sanitized via sanitizeHTML
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(irelandOffice),
                          }}
                        />
                      ) : (
                        irelandOffice
                      )}
                    </div>
                  </div>
                </div>

                {/* Logo and Copyright */}
                <div className="flex flex-col items-center">
                  <Link href="/">
                    <img
                      src={logo || "/muve-logo.png"}
                      className="w-[180px] h-auto"
                      alt="Muve Healthcare Logo"
                    />
                  </Link>
                  <p className="mt-6 text-links text-center whitespace-pre-line leading-relaxed">
                    {copyright}
                  </p>
                </div>

                {/* Links and Socials */}
                <div className="flex flex-col items-center md:items-end gap-6">
                  <nav className="text-sm space-y-2 flex flex-col items-center md:items-end">
                    {(footerLinks || []).map((link, i) => (
                      <Link
                        key={i}
                        href={link.href || "#"}
                        className="text-links hover:text-lightblue transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex gap-4 mt-2">
                    {(socialLinks || []).map((social, i) => (
                      <a
                        key={i}
                        href={social.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:text-lightblue transition-colors"
                      >
                        <img
                          src={`/icons/footer/${social.name}.svg`}
                          className="w-7 h-7"
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
      },
    },
  },
};
