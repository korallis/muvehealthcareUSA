"use server";

import { escapeHtml } from "@/lib/escape-html";

export async function sendServiceEmail(formData: FormData) {
  const tenantId = process.env.MICROSOFT_GRAPH_TENANT_ID;
  const clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
  const senderEmail = process.env.MICROSOFT_GRAPH_SENDER_ID;

  // 1. Construct the Token URL
  const tokenUrl =
    "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";

  const title = (formData.get("form_title") as string) || "New Lead";
  const fullName = (formData.get("Full Name*") as string) || "N/A";
  const phone = (formData.get("Phone Number*") as string) || "N/A";
  const email = (formData.get("Email Address*") as string) || "N/A";

  try {
    // 2. Format the body for Token Request
    const bodyParams = new URLSearchParams();
    bodyParams.append("client_id", clientId || "");
    bodyParams.append("client_secret", clientSecret || "");
    bodyParams.append("grant_type", "client_credentials");
    bodyParams.append("scope", "https://graph.microsoft.com/.default");

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: bodyParams.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("--- TOKEN REJECTION ---", errorText);
      return { success: false, error: "Authentication failed" };
    }

    const tokenData = await response.json();
    console.log("SUCCESS: Token obtained.");

    // 3. Construct the Send Mail URL
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
          subject:
            "Muve Website Inquiry: " +
            (formData.get("form_title") || "New Lead"),
          body: {
            contentType: "HTML",
            content: `
                <h2>New Inquiry: ${escapeHtml(title)}</h2>
                <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              `,
          },
          toRecipients: [
            { emailAddress: { address: "marketing@muvehealthcare.co.uk" } },
          ],
        },
        saveToSentItems: false,
      }),
    });

    if (!mailResponse.ok) {
      const mailError = await mailResponse.text();
      console.error("--- MAIL SEND ERROR ---", mailError);
      return { success: false, error: "Mail rejected by Graph API" };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error(
      "--- CRASH REPORT ---",
      err instanceof Error ? err.message : err,
    );
    return { success: false, error: "Process failed" };
  }
}
