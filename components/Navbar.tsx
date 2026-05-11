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
  [key: string]: unknown; // Allow additional Puck-injected props
}

export default function Navbar({ logo, links, puck }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const [openSubIndex, setOpenSubIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  const isEditing = pathname?.includes("/dashboard/edit");

  // Logic to filter through the links provided in props
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: { title: string; href: string }[] = [];
    links?.forEach((link: NavLink) => {
      // Check main links
      if (link.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ title: link.title, href: link.href });
      }
      // Check sub links
      link.subLinks?.forEach((sub: NavSubLink) => {
        if (sub.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ title: sub.title, href: sub.href });
        }
      });
    });
    return results;
  }, [searchQuery, links]);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setMobileOpen(false);
      setSearchOpen(false);
      setSearchQuery(""); // Clear search on navigation
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery(""); // Clear search when closing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navClasses = isEditing
    ? "w-full bg-navyblue text-white relative z-[1]"
    : "w-full bg-navyblue text-white sticky top-0 z-[50]";

  return (
    <nav ref={puck?.dragRef} className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick}>
            <Image
              src={logo || "/muve-logo.svg"}
              alt="Logo"
              width={140}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-10 font-semibold text-white text-sm">
            {links?.map((link: NavLink, index: number) => (
              <li key={index} className="relative group py-2">
                <div className="flex items-center gap-1 cursor-pointer">
                  <Link
                    href={link.href || "#"}
                    onClick={handleLinkClick}
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
                          onClick={handleLinkClick}
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
                <HiOutlineMagnifyingGlass size={20} />
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
              <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-[60] border border-gray-100">
                {searchResults.length > 0 ? (
                  searchResults.map((result, i) => (
                    <Link
                      key={i}
                      href={result.href}
                      onClick={handleLinkClick}
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

      {/* Backdrop Blur */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[998] lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-navyblue p-6 transition-transform duration-300 z-[999] lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <Link href="/" onClick={handleLinkClick}>
            <Image
              src={logo || "/muve-logo.png"}
              alt="Logo"
              width={110}
              height={55}
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

        <ul className="flex flex-col gap-6 text-lg font-medium">
          {links?.map((link: NavLink, index: number) => {
            const hasSubLinks = (link.subLinks?.length ?? 0) > 0;
            const isOpen = openSubIndex === index;

            return (
              <li key={index} className="flex flex-col">
                <div className="flex items-center justify-between w-full">
                  <Link
                    href={link.href || "#"}
                    onClick={handleLinkClick}
                    className={`hover:text-lightblue font-lexend ${pathname === link.href ? "text-lightblue" : "text-white"}`}
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
                    className={`flex flex-col gap-4 pl-4 mt-4 border-l border-white/10 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {link.subLinks?.map((sub: NavSubLink, subIdx: number) => (
                      <li key={subIdx}>
                        <Link
                          href={sub.href || "#"}
                          onClick={handleLinkClick}
                          className="text-white/70 hover:text-white text-base"
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

        {/* Mobile Search Bar with Results */}
        <div className="mt-10 relative">
          <div className="flex items-center bg-white text-navyblue rounded-full px-4 py-2">
            <HiOutlineMagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isEditing}
              className="ml-3 outline-none flex-1 bg-transparent text-navyblue"
            />
          </div>
          {/* Mobile Search Results */}
          {searchQuery && (
            <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-lg">
              {searchResults.length > 0 ? (
                searchResults.map((result, i) => (
                  <Link
                    key={i}
                    href={result.href}
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-sm text-navyblue border-b border-gray-100 last:border-none"
                  >
                    {result.title}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-xs text-gray-400">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
