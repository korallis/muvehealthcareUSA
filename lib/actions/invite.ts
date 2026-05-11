"use server";

import { db } from "@/db";
import { invitations } from "@/db/schema";
import { randomUUID } from "crypto";
import { escapeHtml } from "@/lib/escape-html";

export async function createInviteAction(formData: FormData) {
  const tenantId = process.env.MICROSOFT_GRAPH_TENANT_ID;
  const clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
  const senderEmail = process.env.MICROSOFT_GRAPH_SENDER_ID;

  const email = (formData.get("email") as string).toLowerCase();
  const inviteToken = randomUUID();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
  const inviteLink =
    baseUrl +
    "/auth/signup?token=" +
    inviteToken +
    "&email=" +
    encodeURIComponent(email);

  try {
    // 1. Save to Database
    await db.insert(invitations).values({
      email,
      token: inviteToken,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
    });

    // 2. Obtain Microsoft Access Token
    const tokenUrl =
      "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";

    const bodyParams = new URLSearchParams();
    bodyParams.append("client_id", clientId || "");
    bodyParams.append("client_secret", clientSecret || "");
    bodyParams.append("grant_type", "client_credentials");
    bodyParams.append("scope", "https://graph.microsoft.com/.default");

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams.toString(),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      throw new Error("Authentication failed");
    }

    const tokenData = await tokenResponse.json();

    // 3. Send via Microsoft Graph
    const sendMailUrl =
      "https://graph.microsoft.com/v1.0/users/" + senderEmail + "/sendMail";

    const mailResponse = await fetch(sendMailUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + tokenData.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: "You've been invited as an Admin",
          body: {
            contentType: "HTML",
            content:
              "<h1>Admin Invitation</h1>" +
              "<p>You have been invited to join the Muve Health dashboard as an administrator.</p>" +
              "<a href='" +
              escapeHtml(inviteLink) +
              "' style='background: #1F3154; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;'>" +
              "Accept Invitation" +
              "</a>" +
              "<p>Or copy this link: " +
              escapeHtml(inviteLink) +
              "</p>",
          },
          toRecipients: [{ emailAddress: { address: email } }],
        },
        saveToSentItems: false,
      }),
    });

    if (!mailResponse.ok) {
      throw new Error("Mail delivery failed");
    }

    return { success: true, inviteLink };
  } catch (err) {
    console.error("Invite Error:", err);
    return { error: "Failed to send invitation." };
  }
}
