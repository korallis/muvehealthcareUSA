"use server";

import { escapeHtml } from "@/lib/escape-html";

export interface FormState {
  success: boolean;
  message: string;
}

export async function sendContactEmail(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const tenantId = process.env.MICROSOFT_GRAPH_TENANT_ID;
  const clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
  const senderEmail = process.env.MICROSOFT_GRAPH_SENDER_ID;

  const tokenUrl =
    "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";

  const fullName = formData.get("fullName");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!fullName || !email || !message) {
    return { success: false, message: "Required fields are missing." };
  }

  try {
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
      return { success: false, message: "Authentication failed." };
    }

    const tokenData = await response.json();

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
          subject: "New Inquiry from " + String(fullName),
          body: {
            contentType: "HTML",
            content:
              "<h2>New Inquiry</h2>" +
              "<p><strong>Name:</strong> " +
              escapeHtml(String(fullName)) +
              "</p>" +
              "<p><strong>Phone:</strong> " +
              escapeHtml(String(phone || "N/A")) +
              "</p>" +
              "<p><strong>Email:</strong> " +
              escapeHtml(String(email)) +
              "</p>" +
              "<p><strong>Message:</strong> " +
              escapeHtml(String(message)) +
              "</p>",
          },
          toRecipients: [
            { emailAddress: { address: "marketing@muvehealthcare.co.uk" } },
          ],
        },
        saveToSentItems: false,
      }),
    });

    if (!mailResponse.ok) {
      return { success: false, message: "Failed to send email." };
    }

    return { success: true, message: "Email sent successfully!" };
  } catch (error: unknown) {
    console.error("Contact email error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
