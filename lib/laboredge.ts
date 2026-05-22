// src/lib/laboredge.ts

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Global variables for in-memory token caching
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Handles OAuth2 authentication and manages token lifetime.
 */
async function getAccessToken(): Promise<string> {
  const currentTime = Date.now();
  
  if (cachedToken && tokenExpiry && currentTime < tokenExpiry - 60000) {
    return cachedToken;
  }

  const response = await fetch(`${process.env.LABOREDGE_API_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: process.env.LABOREDGE_USERNAME,
      password: process.env.LABOREDGE_PASSWORD,
      organizationCode: process.env.LABOREDGE_ORG_CODE,
      grant_type: process.env.LABOREDGE_GRANT_TYPE,
    }),
  });

  if (!response.ok) {
    throw new Error(`LaborEdge Auth Failed: ${response.statusText}`);
  }

  const data: TokenResponse = await response.json();
  
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

/**
 * Pulls job postings from LaborEdge and handles structural data inspection.
 */
export async function fetchLaborEdgeJobs(): Promise<any> {
  try {
    const token = await getAccessToken();

    // Utilizing LaborEdge Nexus default structure: external jobs often use a POST search endpoint
    const response = await fetch(`${process.env.LABOREDGE_API_URL}/api/job-service/v1/ats/external/jobs/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page: 1, size: 50 }), // Adjust pagination payload as needed
      next: { revalidate: 600 }, 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const rawData = await response.json();

    // 👀 DIAGNOSTIC LOGGER: This will print the raw API response safely to your terminal console
    if (process.env.NODE_ENV === 'development') {
      console.log('============= LABOREDGE DATA STREAM START =============');
      console.log(JSON.stringify(rawData, null, 2));
      console.log('============== LABOREDGE DATA STREAM END ==============');
    }

    return rawData;
  } catch (error) {
    console.error('LaborEdge Integration Error:', error);
    throw error;
  }
}
