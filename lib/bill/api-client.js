import https from "https";
import http from "http";
import { URL } from "url";

// Create an HTTPS agent that ignores certificate errors (for development)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Custom fetch function that bypasses SSL certificate validation
 * This is needed because the KWSC API has an expired certificate
 * 
 * Uses a workaround by temporarily setting NODE_TLS_REJECT_UNAUTHORIZED
 * since Next.js native fetch doesn't support agent option directly
 */
export async function fetchWithSSLBypass(url, options = {}) {
  const urlObj = new URL(url);
  
  // Only bypass SSL for HTTPS URLs
  if (urlObj.protocol === "https:") {
    // Save original value
    const originalReject = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    
    try {
      // Temporarily disable SSL certificate validation
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      
      // Use native fetch
      const response = await fetch(url, options);
      
      // Restore original value
      if (originalReject !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalReject;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
      
      return response;
    } catch (error) {
      // Restore original value on error
      if (originalReject !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalReject;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
      throw error;
    }
  }
  
  // For HTTP URLs, use regular fetch
  return fetch(url, options);
}

