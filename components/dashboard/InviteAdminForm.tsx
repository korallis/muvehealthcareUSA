"use client";

import { useState } from "react";
import { createInviteAction } from "@/lib/actions/invite";

export default function InviteAdminForm() {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);

    const result = await createInviteAction(formData);
    if (result.success && result.inviteLink) {
      setInviteLink(result.inviteLink);
    } else {
      alert(result.error || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
      <h3 className="text-lg font-lexendBold text-[#1F3154] mb-4">
        Invite New Admin
      </h3>
      <form onSubmit={handleInvite} className="space-y-4">
        <input
          type="email"
          placeholder="Enter email address"
          className="w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-[#00D9DA]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full py-2 bg-[#1F3154] text-white rounded-xl hover:bg-[#00D9DA] transition-all"
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>
      </form>

      {inviteLink && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
          <p className="text-xs text-green-700 font-lexendBold mb-2">
            Invite Link Generated:
          </p>
          <input
            readOnly
            value={inviteLink}
            className="w-full text-xs p-2 bg-white border rounded-lg mb-2"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              alert("Copied to clipboard!");
            }}
            className="text-xs text-[#1F3154] underline font-lexendBold"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
