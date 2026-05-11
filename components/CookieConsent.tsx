"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ConsentPreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: "",
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) setShowBanner(true);
  }, []);

  function acceptAll() {
    save({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  }

  function rejectNonEssential() {
    save({ ...DEFAULT_CONSENT, timestamp: new Date().toISOString() });
  }

  function save(consent: ConsentPreferences) {
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-lg p-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">
          We use cookies to improve your experience. Essential cookies are
          required for the site to function. You can choose to accept or reject
          optional cookies. See our{" "}
          <Link href="/Privacy" className="underline text-[#1F3154]">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookies" className="underline text-[#1F3154]">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={rejectNonEssential}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-[#1F3154] text-white rounded text-sm hover:bg-[#2a4170]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesButton() {
  function reopenBanner() {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  }

  return (
    <button onClick={reopenBanner} className="text-footer hover:underline">
      Manage Cookie Preferences
    </button>
  );
}
