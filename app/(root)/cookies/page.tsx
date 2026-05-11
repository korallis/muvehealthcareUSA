import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Muve Healthcare",
  description: "Learn about how Muve Healthcare uses cookies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-lexendBold text-[#1F3154] mb-8">
        Cookie Policy
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-lg mb-6">
          This policy explains how Muve Healthcare uses cookies and similar
          technologies on our website.
        </p>

        <h2 className="text-2xl font-lexendBold text-[#1F3154] mt-8 mb-4">
          What are cookies?
        </h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help the website remember your preferences and improve
          your experience.
        </p>

        <h2 className="text-2xl font-lexendBold text-[#1F3154] mt-8 mb-4">
          Cookies we use
        </h2>

        <table className="w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Cookie</th>
              <th className="border border-gray-300 p-3 text-left">Purpose</th>
              <th className="border border-gray-300 p-3 text-left">Type</th>
              <th className="border border-gray-300 p-3 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3">authToken</td>
              <td className="border border-gray-300 p-3">
                Authenticates admin users for the dashboard
              </td>
              <td className="border border-gray-300 p-3">Essential</td>
              <td className="border border-gray-300 p-3">1 hour</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">cookie-consent</td>
              <td className="border border-gray-300 p-3">
                Stores your cookie consent preferences in browser localStorage
                (not an HTTP cookie)
              </td>
              <td className="border border-gray-300 p-3">localStorage</td>
              <td className="border border-gray-300 p-3">
                Persistent (until cleared)
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-lexendBold text-[#1F3154] mt-8 mb-4">
          Managing cookies
        </h2>
        <p>
          You can manage your cookie preferences at any time by clicking
          &quot;Manage Cookie Preferences&quot; in the website footer. You can
          also control cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-lexendBold text-[#1F3154] mt-8 mb-4">
          Contact us
        </h2>
        <p>
          If you have questions about our use of cookies, please contact us at{" "}
          <a
            href="mailto:marketing@muvehealthcare.co.uk"
            className="text-[#1F3154] underline"
          >
            marketing@muvehealthcare.co.uk
          </a>
          .
        </p>

        <p className="mt-8">
          For more information about how we handle your personal data, please
          see our{" "}
          <Link href="/Privacy" className="text-[#1F3154] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
