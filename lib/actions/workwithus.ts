"use server";

import { escapeHtml } from "@/lib/escape-html";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LicensePayload {
  state: string;
  number: string;
  expiry: string;
  statuses: {
    active: boolean;
    inactive: boolean;
    compact: boolean;
    originalState: boolean;
  };
}

interface CertificatePayload {
  module: string;
  dateCompleted: string;
  expirationDate: string;
  fileBase64?: string | null;   // base64-encoded PDF content
  fileName?: string | null;     // original filename e.g. "acls.pdf"
}

interface AdditionalCertPayload {
  name: string;
  dateCompleted: string;
  expirationDate: string;
  fileBase64?: string | null;
  fileName?: string | null;
}

interface WorkWithUsPayload {
  // ── Step 1 ──────────────────────────────────────────────
  title: string;
  dob: string;
  firstName: string;
  middleName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  postal: string;
  country: string;
  usEligible: string;
  email: string;
  phone: string;
  dateAvailable: string;
  positionApplying: string;
  shiftsPreferred: string;
  shiftsExtra: string[];
  typeOfPosition: string;
  typeOfContract: string;
  travelAssignment: string;
  yearsTravel: string;

  // ── Step 2 ──────────────────────────────────────────────
  category: string;
  licenses: LicensePayload[];
  selectedStates: string[];
  blsDateCompleted: string;
  blsExpiration: string;
  blsFileBase64?: string | null;   // base64 BLS/CPR PDF
  blsFileName?: string | null;
  certificates: CertificatePayload[];
  additionalCerts: AdditionalCertPayload[];
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

const e = escapeHtml;

const row = (label: string, value: string) =>
  value
    ? `<tr>
        <td style="padding:6px 12px 6px 0;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;width:200px">${label}</td>
        <td style="padding:6px 0;color:#1f2937;vertical-align:top">${value}</td>
       </tr>`
    : "";

const section = (heading: string, rows: string) => `
  <tr>
    <td colspan="2" style="padding:20px 0 0">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td colspan="2" style="background:#101935;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 14px;border-radius:6px 6px 0 0">
            ${heading}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 6px 6px;padding:10px 14px">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
              ${rows}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

const badge = (text: string, active: boolean) =>
  active
    ? `<span style="display:inline-block;background:#0d9488;color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;margin-right:4px">${text}</span>`
    : "";

// ─── Attachment builder ───────────────────────────────────────────────────────

interface GraphAttachment {
  "@odata.type": "#microsoft.graph.fileAttachment";
  name: string;
  contentType: string;
  contentBytes: string;
}

function buildAttachment(
  base64: string | null | undefined,
  fileName: string | null | undefined,
  fallbackName: string,
): GraphAttachment | null {
  if (!base64) return null;
  return {
    "@odata.type": "#microsoft.graph.fileAttachment",
    name: fileName || fallbackName,
    contentType: "application/pdf",
    contentBytes: base64,
  };
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function sendWorkWithUsEmail(payload: WorkWithUsPayload) {
  const tenantId     = process.env.MICROSOFT_GRAPH_TENANT_ID;
  const clientId     = process.env.MICROSOFT_GRAPH_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
  const senderEmail  = process.env.MICROSOFT_GRAPH_SENDER_ID;

  const tokenUrl =
    "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";

  // ── Derived values ─────────────────────────────────────────────────────────

  const fullName = [payload.title, payload.firstName, payload.middleName, payload.lastName]
    .filter(Boolean)
    .join(" ");

  const allShifts = [payload.shiftsPreferred, ...payload.shiftsExtra]
    .filter(Boolean)
    .join(", ");

  // ── Collect all attachments ────────────────────────────────────────────────

  const attachments: GraphAttachment[] = [];

  // BLS / CPR
  const blsAttachment = buildAttachment(
    payload.blsFileBase64,
    payload.blsFileName,
    "BLS_CPR_Certificate.pdf",
  );
  if (blsAttachment) attachments.push(blsAttachment);

  // Additional training certificates
  payload.certificates
    .filter((c) => c.module && c.fileBase64)
    .forEach((c, i) => {
      const att = buildAttachment(
        c.fileBase64,
        c.fileName,
        `Training_Certificate_${i + 1}.pdf`,
      );
      if (att) attachments.push(att);
    });

  // Additional training completed
  payload.additionalCerts
    .filter((c) => c.name && c.fileBase64)
    .forEach((c, i) => {
      const att = buildAttachment(
        c.fileBase64,
        c.fileName,
        `Additional_Certificate_${i + 1}.pdf`,
      );
      if (att) attachments.push(att);
    });

  // ── Build email rows ───────────────────────────────────────────────────────

  const licenseRows = payload.licenses
    .filter((l) => l.state || l.number)
    .map(
      (l, i) => `
      <tr><td colspan="2" style="padding:8px 0 2px"><strong style="color:#101935">License ${i + 1}</strong></td></tr>
      ${row("State", e(l.state))}
      ${row("License Number", e(l.number))}
      ${row("Expiry", e(l.expiry))}
      ${row("Status", [
        badge("Active", l.statuses.active),
        badge("Inactive", l.statuses.inactive),
        badge("Compact", l.statuses.compact),
        badge("Original State", l.statuses.originalState),
      ].join("") || "—")}
    `,
    )
    .join("<tr><td colspan='2' style='padding:4px 0'><hr style='border:none;border-top:1px solid #e2e8f0'></td></tr>");

  const certRows = payload.certificates
    .filter((c) => c.module)
    .map(
      (c, i) => `
      <tr><td colspan="2" style="padding:8px 0 2px"><strong style="color:#101935">Certificate ${i + 1}</strong></td></tr>
      ${row("Training Module", e(c.module))}
      ${row("Date Completed", e(c.dateCompleted))}
      ${row("Expiration Date", e(c.expirationDate))}
      ${row("File", c.fileBase64 ? `<span style="color:#0d9488;font-weight:600">✓ Attached (${e(c.fileName || "certificate.pdf")})</span>` : "—")}
    `,
    )
    .join("<tr><td colspan='2' style='padding:4px 0'><hr style='border:none;border-top:1px solid #e2e8f0'></td></tr>");

  const additionalCertRows = payload.additionalCerts
    .filter((c) => c.name)
    .map(
      (c, i) => `
      <tr><td colspan="2" style="padding:8px 0 2px"><strong style="color:#101935">Certificate ${i + 1}</strong></td></tr>
      ${row("Certificate Name", e(c.name))}
      ${row("Date Completed", e(c.dateCompleted))}
      ${row("Expiration Date", e(c.expirationDate))}
      ${row("File", c.fileBase64 ? `<span style="color:#0d9488;font-weight:600">✓ Attached (${e(c.fileName || "certificate.pdf")})</span>` : "—")}
    `,
    )
    .join("<tr><td colspan='2' style='padding:4px 0'><hr style='border:none;border-top:1px solid #e2e8f0'></td></tr>");

  const statesDisplay =
    payload.selectedStates.length > 0
      ? payload.selectedStates
          .map(
            (s) =>
              `<span style="display:inline-block;background:#f1f5f9;border:1px solid #cbd5e1;color:#334155;font-size:11px;font-weight:600;padding:2px 7px;border-radius:4px;margin:2px">${e(s)}</span>`,
          )
          .join("")
      : "None selected";

  // ── Email HTML ─────────────────────────────────────────────────────────────

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

          <!-- Header -->
          <tr>
            <td style="background:#101935;padding:24px 28px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#fff;font-size:18px;font-weight:700;vertical-align:middle">Muve Healthcare USA Website</span>
                    <span style="color:rgba(255,255,255,0.4);font-size:11px;margin-left:8px;letter-spacing:.1em;text-transform:uppercase;vertical-align:middle">Staffing Solutions</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px">
                    <div style="color:#fff;font-size:22px;font-weight:700">New Work With Us Application</div>
                    <div style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:2px">${fullName ? e(fullName) : "Applicant"}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Attachment summary banner -->
          ${attachments.length > 0 ? `
          <tr>
            <td style="background:#f0fdf9;border-bottom:1px solid #99f6e4;padding:10px 28px">
              <p style="margin:0;font-size:12px;color:#0f766e;font-weight:600">
                📎 ${attachments.length} PDF attachment${attachments.length > 1 ? "s" : ""} included: ${attachments.map(a => e(a.name)).join(", ")}
              </p>
            </td>
          </tr>` : ""}

          <!-- Body -->
          <tr>
            <td style="padding:24px 28px">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">

                ${section("Personal Information", `
                  ${row("Full Name", e(fullName))}
                  ${row("Date of Birth", e(payload.dob))}
                  ${row("Email", e(payload.email))}
                  ${row("Phone", e(payload.phone))}
                  ${row("US Work Eligible", e(payload.usEligible))}
                `)}

                ${section("Address", `
                  ${row("Address Line 1", e(payload.addressLine1))}
                  ${row("Address Line 2", e(payload.addressLine2))}
                  ${row("City", e(payload.city))}
                  ${row("State / Province", e(payload.stateRegion))}
                  ${row("Postal / Zip Code", e(payload.postal))}
                  ${row("Country", e(payload.country))}
                `)}

                ${section("Availability & Preferences", `
                  ${row("Date Available", e(payload.dateAvailable))}
                  ${row("Position Applying For", e(payload.positionApplying))}
                  ${row("Shifts Preferred", e(allShifts))}
                  ${row("Type of Position", e(payload.typeOfPosition))}
                  ${row("Type of Contract", e(payload.typeOfContract))}
                `)}

                ${section("Travel Experience", `
                  ${row("Completed Travel Assignment", e(payload.travelAssignment))}
                  ${row("Years of Travel Experience", e(payload.yearsTravel))}
                `)}

                ${section("Category / Discipline", row("Category", e(payload.category)))}

                ${licenseRows ? section("Professional Licenses", licenseRows) : ""}

                ${section("States of Interest",
                  `<tr><td colspan="2" style="padding:6px 0">${statesDisplay}</td></tr>`
                )}

                ${section("Mandatory Certification — BLS / CPR", `
                  ${row("Date Completed", e(payload.blsDateCompleted))}
                  ${row("Expiration Date", e(payload.blsExpiration))}
                  ${row("File", payload.blsFileBase64
                    ? `<span style="color:#0d9488;font-weight:600">✓ Attached (${e(payload.blsFileName || "BLS_CPR_Certificate.pdf")})</span>`
                    : "Not uploaded")}
                `)}

                ${certRows ? section("Additional Training Certifications", certRows) : ""}
                ${additionalCertRows ? section("Additional Training Completed", additionalCertRows) : ""}

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;text-align:center">
              <p style="margin:0;font-size:11px;color:#94a3b8">
                This email was generated automatically from the Muve HealthCare USA "Work With Us" application form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // ── Authenticate ───────────────────────────────────────────────────────────

  try {
    const bodyParams = new URLSearchParams();
    bodyParams.append("client_id", clientId || "");
    bodyParams.append("client_secret", clientSecret || "");
    bodyParams.append("grant_type", "client_credentials");
    bodyParams.append("scope", "https://graph.microsoft.com/.default");

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: bodyParams.toString(),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("--- TOKEN REJECTION ---", errorText);
      return { success: false, error: "Authentication failed" };
    }

    const tokenData = await tokenResponse.json();
    console.log("SUCCESS: Token obtained.");

    // ── Send mail ──────────────────────────────────────────────────────────

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
          subject: `Work With Us Application: ${fullName || "New Applicant"}`,
          body: {
            contentType: "HTML",
            content: htmlBody,
          },
          toRecipients: [
            { emailAddress: { address: "Vikas.Jha@muvehealthcare.com" } },
          ],
          attachments,   // ← PDFs attached here
        },
        saveToSentItems: true,
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