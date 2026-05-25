import { NextResponse } from "next/server";

// Force Next.js to never cache this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // 1. Immediate Initial Checkpoint to verify the route is even being hit
  console.log("🚀 [LaborEdge Route Triggered]: Execution started at", new Date().toISOString());

  try {
    const username = process.env.LABOREDGE_USERNAME || "";
    const password = process.env.LABOREDGE_PASSWORD || "";
    const orgCode = process.env.LABOREDGE_ORG_CODE || "";
    const grantType = process.env.LABOREDGE_GRANT_TYPE || "password";

    if (!username || !password || !orgCode) {
      console.warn("⚠️ [Warning]: Missing required environment variables.");
    }

    const loginPayload = new URLSearchParams();
    loginPayload.append("username", username);
    loginPayload.append("password", password);
    loginPayload.append("organizationCode", orgCode);
    loginPayload.append("grant_type", grantType);

    console.log("🔑 [Step 1/3]: Authenticating with LaborEdge OAuth portal...");
    
    // Add a 10-second timeout controller so the server doesn't hang silently
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const authResponse = await fetch("https://api-nexus.laboredge.com/auth/oauth2/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Authorization": "Basic bmV4dXM6NXM6Nn5EcEhaelcmVFoj" 
      },
      body: loginPayload,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error("❌ Authentication failed:", authError);
      return NextResponse.json({ error: "Authentication failed", details: authError }, { status: authResponse.status });
    }

    const authData = await authResponse.json();
    const token = authData.access_token;
    console.log("✅ Token successfully generated.");

    const searchUrl = "https://api-nexus.laboredge.com:9000/api/job-service/v1/ats/external/jobs/search";
    const requestHeaders = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "organizationCode": orgCode,
      "X-Organization-Code": orgCode 
    };

    console.log("📡 [Step 2/3]: Streaming data concurrent blocks from endpoint...");

    // Execute both queries concurrently
    const [hotJobsResponse, regularJobsResponse] = await Promise.all([
      fetch(searchUrl, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          "jobStatusCode": "OPEN", 
          "hotJob": true,
          "pagingDetails": { "start": 0 }
        }), 
      }),
      fetch(searchUrl, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          "jobStatusCode": "OPEN", 
          "hotJob": false,
          "pagingDetails": { "start": 0 }
        }), 
      })
    ]);

    console.log("📦 [Step 3/3]: Parsing API payloads...");

    if (!hotJobsResponse.ok || !regularJobsResponse.ok) {
      console.error(`❌ API Stream Error. Hot status: ${hotJobsResponse.status} | Regular status: ${regularJobsResponse.status}`);
      return NextResponse.json({ error: "Failed to fetch data from staffing server" }, { status: 500 });
    }

    const hotJobsData = await hotJobsResponse.json();
    const regularJobsData = await regularJobsResponse.json();

    const hotJobsList = hotJobsData.records || [];
    const regularJobsList = regularJobsData.records || [];

    const jobsArray = [...hotJobsList, ...regularJobsList];
    const serverCountTotal = (hotJobsData.count || 0) + (regularJobsData.count || 0);
    
    // THIS WILL FORCE PRINT TO YOUR TERMINAL WINDOW RUNNING THE SERVER
    console.log("\n================= LABOREDGE DATA STREAM =================");
    console.log(`Status: 200 OK`);
    console.log(`Hot Jobs Found: ${hotJobsList.length} (Server count flag: ${hotJobsData.count})`);
    console.log(`Regular Jobs Found: ${regularJobsList.length} (Server count flag: ${regularJobsData.count})`);
    console.log(`Combined Local Array Count: ${jobsArray.length} | Server Expected: ${serverCountTotal}`);
    
    if (jobsArray.length > 0) {
      console.log("📦 Data Blueprint (First Record Sample Excerpt):");
      console.log(JSON.stringify(jobsArray[0], null, 2));
    } else {
      console.log("⚠️ Zero entries found inside the record streams.");
    }
    console.log("=========================================================\n");

    // Force strict client headers to prevent browser caching as well
    return new NextResponse(JSON.stringify(jobsArray), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error: any) {
    console.error("💥 Critical connection wrapper error encountered:", error.message);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}