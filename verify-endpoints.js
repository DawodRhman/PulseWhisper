const http = require('http');

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;

const ENDPOINTS = [
  '/api/services',
  '/api/tenders',
  '/api/careers',
  '/api/news',
  '/api/rti',
  '/api/watertoday',
  '/api/contact',
  '/api/education',
  '/api/pages'
];

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint}`;
    const start = Date.now();
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - start;
        try {
          const json = JSON.parse(data);
          const hasData = json.data || json.length > 0 || (Array.isArray(json) && json.length > 0);
          
          // Specific checks based on structure
          let itemCount = 0;
          if (json.data) {
             if (Array.isArray(json.data)) itemCount = json.data.length;
             else if (json.data.categories) itemCount = json.data.categories.length; // Services
             else if (json.data.tenders) itemCount = json.data.tenders.length; // Tenders
             else if (json.data.openings) itemCount = json.data.openings.length; // Careers
             else if (json.data.documents) itemCount = json.data.documents.length; // RTI
             else if (json.data.updates) itemCount = json.data.updates.length; // Water Today
             else if (json.data.channels) itemCount = json.data.channels.length; // Contact
             else if (json.data.resources) itemCount = json.data.resources.length; // Education
          } else if (Array.isArray(json)) {
              itemCount = json.length;
          }

          resolve({
            endpoint,
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            duration,
            itemCount,
            error: null
          });
        } catch (e) {
          resolve({
            endpoint,
            status: res.statusCode,
            ok: false,
            duration,
            itemCount: 0,
            error: "Invalid JSON"
          });
        }
      });
    }).on('error', (err) => {
      resolve({
        endpoint,
        status: 0,
        ok: false,
        duration: 0,
        itemCount: 0,
        error: err.message
      });
    });
  });
}

async function waitForServer() {
  console.log(`Waiting for server at ${BASE_URL}...`);
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(BASE_URL, (res) => {
          if (res.statusCode) resolve();
        });
        req.on('error', reject);
        req.end();
      });
      console.log("Server is up!");
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log("Server timed out.");
  return false;
}

async function runTests() {
  const serverUp = await waitForServer();
  if (!serverUp) {
    console.log("❌ Could not connect to server. Make sure 'npm run dev' is running.");
    return;
  }

  console.log(`Checking endpoints on ${BASE_URL}...\n`);
  console.log(`${"ENDPOINT".padEnd(20)} | ${"STATUS".padEnd(8)} | ${"ITEMS".padEnd(6)} | ${"TIME".padEnd(8)} | ${"RESULT"}`);
  console.log("-".repeat(70));

  let allPassed = true;

  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    const statusColor = result.ok ? "PASS" : "FAIL";
    const errorMsg = result.error ? `(${result.error})` : "";
    
    console.log(
      `${result.endpoint.padEnd(20)} | ${String(result.status).padEnd(8)} | ${String(result.itemCount).padEnd(6)} | ${String(result.duration + 'ms').padEnd(8)} | ${statusColor} ${errorMsg}`
    );

    if (!result.ok) allPassed = false;
  }

  console.log("-".repeat(70));
  if (allPassed) {
    console.log("\n✅ All endpoints are responding correctly.");
  } else {
    console.log("\n❌ Some endpoints failed.");
  }
}

runTests();
