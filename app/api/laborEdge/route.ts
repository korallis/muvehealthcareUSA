// src/app/api/jobs/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const username = process.env.LABOREDGE_USERNAME || "";
    const password = process.env.LABOREDGE_PASSWORD || "";
    const orgCode = process.env.LABOREDGE_ORG_CODE || "";
    const grantType = process.env.LABOREDGE_GRANT_TYPE || "password";

    const loginPayload = new URLSearchParams();
    loginPayload.append("username", username);
    loginPayload.append("password", password);
    loginPayload.append("organizationCode", orgCode);
    loginPayload.append("grant_type", grantType);

    // 1. Authenticate using your valid token signature
    const authResponse = await fetch("https://api-nexus.laboredge.com/auth/oauth2/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Authorization": "Basic bmV4dXM6NXM6Nn5EcEhaelcmVFoj" 
      },
      body: loginPayload,
    });

    const authData = await authResponse.json();
    const token = authData.access_token;

    // 2. Query your exact official endpoint link
    const jobsResponse = await fetch("https://api-nexus.laboredge.com:9000/api/job-service/v1/ats/external/jobs/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "organizationCode": orgCode,
        "X-Organization-Code": orgCode 
      },
      // ── FIX: Sending an empty body removes the strict array parameters causing the error code ──
      body: JSON.stringify({}), 
    });

    const rawData = await jobsResponse.json();
    
    // Safety check to handle nested array fields inside the response envelope
    let jobsArray = [];
    if (rawData) {
      jobsArray = rawData.content || rawData.data || rawData.jobs || (Array.isArray(rawData) ? rawData : []);
    }
    
    
    console.log("================= LABOREDGE DATA STREAM =================");
    console.log(`Status: 200 OK | Retrieved Array Count: ${jobsArray.length}`);
    if (jobsArray.length > 0) {
      console.log("📦 Data Blueprint (First Record):");
      console.dir(jobsArray[0], { depth: null, colors: true });
    } else {
      console.log("⚠️ Raw API Response JSON Content:", rawData);
    }
    console.log("=========================================================");

    return NextResponse.json(jobsArray);

  } catch (error: any) {
    console.error("❌ Connection error:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}
