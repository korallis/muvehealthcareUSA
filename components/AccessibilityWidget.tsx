"use client";

import React, { useEffect, useState } from "react";

const HeartIcon = () => <span className="text-white">❤</span>;

function ListItem({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center text-left py-2 px-3 rounded-lg transition-all ${
        active
          ? "bg-white/20 font-lexendBold underline decoration-2 underline-offset-4"
          : "hover:bg-white/10 font-normal"
      } text-white`}
    >
      <HeartIcon />
      <span className="ml-4">{children}</span>
      {active && (
        <span className="ml-auto text-[10px] font-lexendBold bg-white text-purple-900 px-1.5 rounded">
          ON
        </span>
      )}
    </button>
  );
}

type AccessibilitySettings = {
  fontScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
  grayscale: boolean;
  negativeContrast: boolean;
  lightBackground: boolean;
  readableFont: boolean;
};

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  highContrast: false,
  reducedMotion: false,
  grayscale: false,
  negativeContrast: false,
  lightBackground: false,
  readableFont: false,
};

// Fixed JSX Type Error by using React.ReactElement
export default function AccessibilityWidget(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [settings, setSettings] =
    useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Accessibility Load Error", e);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // 1. Handle Text Scaling
    root.style.fontSize = `${settings.fontScale * 100}%`;

    // 2. Handle Combined Filters (Grayscale + Negative)
    const filterArray = [];
    if (settings.grayscale) filterArray.push("grayscale(100%)");
    if (settings.negativeContrast)
      filterArray.push("invert(100%) hue-rotate(180deg)");
    root.style.filter = filterArray.length > 0 ? filterArray.join(" ") : "";

    // 3. Handle Class-based Toggles
    const toggleClass = (className: string, condition: boolean) => {
      if (condition) root.classList.add(className);
      else root.classList.remove(className);
    };

    toggleClass("contrast-mode", settings.highContrast);
    toggleClass("light-bg-mode", settings.lightBackground);
    toggleClass("readable-font", settings.readableFont);
    toggleClass("reduce-motion", settings.reducedMotion);

    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <>
      <button
        aria-label="Open accessibility options"
        onClick={() => setOpen(true)}
        // Restored your original 'bg-blue' and sizing
        className="fixed right-0 top-2/6 z-[9998] flex h-14 w-12 -translate-y-1/2 items-center justify-center rounded-l-2xl bg-blue p-3 transition-all hover:bg-lightblue"
      >
        <img
          src="/icons/accessibility.svg"
          alt=""
          className="w-full h-full brightness-0 invert"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        role="dialog"
        aria-label="Accessibility Menu"
        className={`fixed right-0 top-1/2 z-[10000] w-72 -translate-y-1/2 transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } rounded-l-3xl overflow-hidden bg-purple`} // Restored bg-purple
      >
        <div className="bg-purple p-5 border-b border-white/10">
          <h4 className="text-sm font-lexendBold text-white uppercase tracking-widest">
            Accessibility Tools
          </h4>
        </div>

        <div className="p-4 space-y-1 font-lexend">
          <ListItem
            onClick={() =>
              setSettings((s) => ({
                ...s,
                fontScale: Math.min(s.fontScale + 0.1, 1.1),
              }))
            }
          >
            Increase Text Size
          </ListItem>

          <ListItem
            onClick={() =>
              setSettings((s) => ({
                ...s,
                fontScale: Math.max(s.fontScale - 0.1, 0.9),
              }))
            }
          >
            Decrease Text Size
          </ListItem>

          <ListItem
            active={settings.grayscale}
            onClick={() => toggleSetting("grayscale")}
          >
            Grayscale Mode
          </ListItem>

          <ListItem
            active={settings.highContrast}
            onClick={() => toggleSetting("highContrast")}
          >
            High Contrast
          </ListItem>

          <ListItem
            active={settings.negativeContrast}
            onClick={() => toggleSetting("negativeContrast")}
          >
            Negative Contrast
          </ListItem>

          <ListItem
            active={settings.lightBackground}
            onClick={() => toggleSetting("lightBackground")}
          >
            Light Background
          </ListItem>

          <ListItem
            active={settings.readableFont}
            onClick={() => toggleSetting("readableFont")}
          >
            Readable Font
          </ListItem>

          <div className="pt-4 mt-2 border-t border-white/10">
            <ListItem onClick={() => setSettings(DEFAULT_SETTINGS)}>
              Reset All Settings
            </ListItem>
          </div>
        </div>

        <a
          href="tel:08081754091"
          className="flex items-center w-full bg-blue p-5 text-white font-lexendBold hover:opacity-90 transition-colors"
        >
          <HeartIcon />
          <span className="ml-4 text-sm">Call Muve Healthcare</span>
        </a>
      </aside>
    </>
  );
}
