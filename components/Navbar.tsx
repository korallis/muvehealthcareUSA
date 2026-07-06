"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoClose, IoMenu, IoChevronDown } from "react-icons/io5";
import { usePathname } from "next/navigation";

interface NavSubLink {
  title: string;
  href: string;
}

interface NavLink {
  title: string;
  href: string;
  dropdownBg?: string;
  textColor?: string;
  subLinks?: NavSubLink[];
}

interface NavbarProps {
  logo?: string;
  links?: NavLink[];
  puck?: { isEditing: boolean; dragRef?: React.Ref<HTMLElement> };
  [key: string]: unknown;
}

export default function Navbar({ logo, links, puck }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubIndex, setOpenSubIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // Solves Server/Client Hydration Error

  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  const isEditing = pathname?.includes("/dashboard/edit");

  // Delay interactivity safely until hydration finishes on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: { title: string; href: string }[] = [];
    links?.forEach((link: NavLink) => {
      if (link.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ title: link.title, href: link.href });
      }
      link.subLinks?.forEach((sub: NavSubLink) => {
        if (sub.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ title: sub.title, href: sub.href });
        }
      });
    });
    return results;
  }, [searchQuery, links]);

  const handleLinkClick = (e: React.MouseEvent, href?: string) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (href && href.includes("#")) {
      const [urlPath, anchorId] = href.split("#");

      // Normalize layout path strings to match root scopes cleanly
      const cleanUrlPath = urlPath === "" || urlPath === "/" ? "/" : urlPath;
      const cleanCurrentPath = pathname === "" || pathname === "/" ? "/" : pathname;

      // Only handle smooth scroll if the target ID is on the active route
      if (cleanCurrentPath === cleanUrlPath) {
        const targetElement = document.getElementById(anchorId);

        if (targetElement) {
          e.preventDefault();

          // scrollIntoView lets the browser own the entire scroll path
          // (including sticky-header-aware layout) rather than us feeding it
          // one manually computed pixel value via scrollTo — this tends to
          // be noticeably smoother, especially with a sticky navbar.
          // scroll-margin-top makes it stop clear of the sticky navbar.
          const navbarOffset = 80;
          targetElement.style.scrollMarginTop = `${navbarOffset}px`;
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

          // Update the hash without jumping (native smooth scroll keeps animating)
          window.history.pushState(null, "", `#${anchorId}`);
        }
      }
    }

    // Deferred to the next tick so closing the mobile drawer / search
    // dropdown (a layout change) doesn't land on the exact same frame the
    // smooth-scroll animation starts, which can cause a stutter at kickoff.
    requestAnimationFrame(() => {
      setMobileOpen(false);
      setSearchOpen(false);
      setSearchQuery("");
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Structural fix for truncated "z-" layout tracking configurations
  const navClasses = isEditing
    ? "w-full bg-[#07004C] text-white relative z-10"
    : "w-full bg-[#07004C] text-white sticky top-0 z-50";

  // Match initial layout properties smoothly during the hydration transition
  if (!mounted) {
    return <nav className={navClasses} style={{ height: "76px" }} />;
  }

  return (
    <nav ref={puck?.dragRef} className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/test" onClick={(e) => handleLinkClick(e, "/test")}>
            <Image
              src={logo || "/muve-logo.svg"}
              alt="Logo"
              width={140}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav Layout */}
          <ul className="hidden lg:flex items-center gap-10 font-semibold text-white text-sm">
            {links?.map((link: NavLink, index: number) => (
              <li key={index} className="relative group py-2">
                <div className="flex items-center gap-1 cursor-pointer">
                  <Link
                    href={link.href || "#"}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`hover:text-lightblue font-lexend transition-colors ${pathname === link.href ? "text-lightblue" : "text-white"}`}
                  >
                    {link.title}
                  </Link>
                  {(link.subLinks?.length ?? 0) > 0 && (
                    <IoChevronDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform"
                    />
                  )}
                </div>

                {(link.subLinks?.length ?? 0) > 0 && (
                  <ul
                    className={`absolute left-0 top-full hidden group-hover:block w-52 font-lexendBold rounded-b-md py-3 border-t-2 border-white/10 ${link.dropdownBg || "bg-[#24345E]"}`}
                  >
                    {link.subLinks?.map((sub: NavSubLink, subIdx: number) => (
                      <li key={subIdx}>
                        <Link
                          href={sub.href || "#"}
                          onClick={(e) => handleLinkClick(e, sub.href)}
                          className={`block px-5 py-2 hover:bg-black/10 transition-colors whitespace-nowrap ${link.textColor || "text-white"}`}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Search */}
          <div ref={searchRef} className="relative hidden lg:flex items-center">
            <div
              className={`flex items-center bg-white text-navyblue rounded-full overflow-hidden transition-all duration-300 ${searchOpen ? "w-64 px-4" : "w-12 px-0"}`}
            >
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center justify-center w-12 h-10"
              >
                <HiOutlineMagnifyingGlass size={20} className="text-[#07004C]" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isEditing}
                className={`bg-transparent ml-2 text-navyblue outline-none flex-1 transition-all duration-300 ${searchOpen ? "opacity-100" : "opacity-0 pointer-events-none w-0"}`}
              />
            </div>

            {/* REAL-TIME RESULTS DROPDOWN */}
            {searchOpen && searchQuery && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100">
                {searchResults.length > 0 ? (
                  searchResults.map((result, i) => (
                    <Link
                      key={i}
                      href={result.href}
                      onClick={(e) => handleLinkClick(e, result.href)}
                      className="block px-4 py-3 text-sm text-navyblue hover:bg-lightblue/10 border-b border-gray-50 last:border-none transition-colors"
                    >
                      {result.title}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 italic">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white text-3xl"
          >
            <IoMenu />
          </button>
        </div>
      </div>

      {/* Backdrop Blur Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Side Drawer Component */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#07004C] p-6 transition-transform duration-300 z-50 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" onClick={(e) => handleLinkClick(e, "/")}>
            <Image
              src={logo || "/muve-logo.svg"}
              alt="Logo"
              width={120}
              height={50}
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-3xl text-white"
          >
            <IoClose />
          </button>
        </div>

        <ul className="flex flex-col gap-6 font-semibold text-white text-sm">
          {links?.map((link: NavLink, index: number) => {
            const hasSubLinks = (link.subLinks?.length ?? 0) > 0;
            const isOpen = openSubIndex === index;

            return (
              <li key={index}>
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href || "#"}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`font-lexend transition-colors ${pathname === link.href ? "text-lightblue" : "text-white"}`}
                  >
                    {link.title}
                  </Link>
                  {hasSubLinks && (
                    <button
                      onClick={() => setOpenSubIndex(isOpen ? null : index)}
                      className="text-white p-1"
                    >
                      <IoChevronDown
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {hasSubLinks && (
                  <ul
                    className={`flex flex-col gap-4 pl-4 mt-4 border-l border-white/10 overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {link.subLinks?.map((sub: NavSubLink, subIdx: number) => (
                      <li key={subIdx}>
                        <Link
                          href={sub.href || "#"}
                          onClick={(e) => handleLinkClick(e, sub.href)}
                          className="block text-white/80 hover:text-white transition-colors"
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
