"use server";

import { escapeHtml } from "@/lib/escape-html";

export interface FormState {
  success: boolean;
  message: string;
}

export async function sendFeedbackEmail(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const tenantId = process.env.MICROSOFT_GRAPH_TENANT_ID;
  const clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
  const senderEmail = process.env.MICROSOFT_GRAPH_SENDER_ID;

  // 1. Capture Feedback Data
  const feedbackType = formData.get("feedbackType") as string;
  const userType = formData.get("userType") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  const tokenUrl =
    "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";

  try {
    // 2. Obtain Access Token
    const bodyParams = new URLSearchParams();
    bodyParams.append("client_id", clientId || "");
    bodyParams.append("client_secret", clientSecret || "");
    bodyParams.append("grant_type", "client_credentials");
    bodyParams.append("scope", "https://graph.microsoft.com/.default");

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, message: "Authentication failed." };
    }

    const tokenData = await response.json();

    // 3. Construct Send Mail URL (Fixed Version)
    const sendMailUrl =
      "https://graph.microsoft.com/v1.0/users/" + senderEmail + "/sendMail";

    // 4. Send Email via Graph API
    const mailResponse = await fetch(sendMailUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `${feedbackType} Received from ${firstName} ${lastName}`,
          body: {
            contentType: "HTML",
            content: `
              <h2>New ${escapeHtml(feedbackType)} Submission</h2>
              <p><strong>I am a:</strong> ${escapeHtml(userType)}</p>
              <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${escapeHtml(message)}</p>
            `,
          },
          toRecipients: [
            { emailAddress: { address: "marketing@muvehealthcare.co.uk" } },
          ],
        },
        saveToSentItems: false, // Boolean, not string
      }),
    });

    if (!mailResponse.ok) {
      const errorDetail = await mailResponse.text();
      console.error("Graph API Error:", errorDetail);
      return { success: false, message: "Error sending feedback." };
    }

    return { success: true, message: "Feedback sent successfully!" };
  } catch (err) {
    console.error("Server Crash:", err);
    return { success: false, message: "Server error occurred." };
  }
}
