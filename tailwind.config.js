/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./puck.config.tsx",
  ],

  // SAFELIST: Prevents Tailwind from deleting these colors
  safelist: [
    "prose",
    "prose-invert",
    "prose-slate",
    "list-disc",
    "pl-5",

    "translate-x-full",
    "translate-x-0",

    "bg-purple",
    "bg-lightblue",
    "bg-navyblue",
    "bg-fadedpurple",
    "bg-white",
    "bg-transparent",
    "bg-muvelivingcolor",
    "bg-muvehorizonscolor",
    "bg-muvecommunitycolor",
    "bg-muvemindscolor",
    "bg-muvebrightcolor",
  ],
  theme: {
    extend: {
      // COLORS
      colors: {
        purple: "#918CF2",
        lightblue: "#00D9D4",
        navyblue: "#24345E",
        blue: "#4056E3",
        fadedpurple: "#A7A3F5",
        primaryText: "#ffffff",

        muvelivingcolor: "#FFD263",
        muvehorizonscolor: "#F6D0D1",
        muvecommunitycolor: "#F6E7D6",
        muvemindscolor: "#E8E3DF",
        muvebrightcolor: "#4ABEB3",
      },
      fontFamily: {
        lexend: ["var(--font-lexend)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
