import { NextResponse } from "next/server";
import { fetchWithSSLBypass } from "@/lib/bill/api-client";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { consumerId } = body;

    if (!consumerId || consumerId.trim() === "") {
      return NextResponse.json(
        { status: 0, message: "Consumer ID is required." },
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const apiBaseUrl = process.env.KWSC_API_BASE_URL || "https://kwsconline.com:5000";
    const apiUsername = process.env.KWSC_API_USERNAME || "websiteapikw@sc";
    const apiPassword = process.env.KWSC_API_PASSWORD || "kW@$c!#$&";

    // First API call: GetConsumerBillDetails
    const url1 = `${apiBaseUrl}/api/BankCollection/GetConsumerBillDetails`;
    const params1 = new URLSearchParams({
      consumer_no: consumerId.trim(),
      username: apiUsername,
      password: apiPassword,
    });

    const fullUrl1 = `${url1}?${params1}`;
    console.log("Calling API:", fullUrl1.replace(apiPassword, "***"));

    const response1 = await fetchWithSSLBypass(fullUrl1, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Parse response even if status is not ok (API might return 400 with error data)
    let billData;
    try {
      billData = await response1.json();
    } catch (parseError) {
      const errorText = await response1.text();
      console.error(`API call failed: ${response1.status}`, errorText);
      throw new Error(`API call failed: ${response1.status} - ${errorText.substring(0, 100)}`);
    }

    // Check if API returned an error status
    if (!response1.ok || billData.status === "Error") {
      console.error(`API returned error:`, billData);
      return NextResponse.json({
        status: 0,
        message: billData.message || "Please check your consumer ID.",
      });
    }

    // Check if bill data is valid
    if (
      !billData ||
      !billData.retailBillPrintingComplete ||
      (Array.isArray(billData.retailBillPrintingComplete) && billData.retailBillPrintingComplete.length === 0)
    ) {
      return NextResponse.json({
        status: 0,
        message: "Please check your consumer ID.",
      });
    }

    // Check if all fields are empty (invalid consumer ID)
    const billDetails = Array.isArray(billData.retailBillPrintingComplete)
      ? billData.retailBillPrintingComplete[0]
      : billData.retailBillPrintingComplete;

    if (!billDetails || !billDetails.conS_NO || billDetails.conS_NO.trim() === "") {
      return NextResponse.json({
        status: 0,
        message: "Please check your consumer ID.",
      });
    }

    // Second API call: GetConsumerBill (for payment status)
    const url2 = `${apiBaseUrl}/api/BankCollection/GetConsumerBill`;
    const params2 = new URLSearchParams({
      consumer_no: consumerId.trim(),
      username: apiUsername,
      password: apiPassword,
    });

    const fullUrl2 = `${url2}?${params2}`;
    console.log("Calling API:", fullUrl2.replace(apiPassword, "***"));

    const response2 = await fetchWithSSLBypass(fullUrl2, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Parse response even if status is not ok
    let billStatusData = { data: [] };
    try {
      // Clone response first so we can read it multiple times if needed
      const clonedResponse2 = response2.clone();
      
      if (response2.ok) {
        try {
          billStatusData = await response2.json();
        } catch (jsonError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await clonedResponse2.text();
            console.error(`Second API JSON parse failed:`, errorText);
          } catch (textError) {
            console.error(`Second API response could not be read`);
          }
          billStatusData = { data: [] };
        }
      } else {
        // If response is not ok, try to get error text
        try {
          const errorText = await clonedResponse2.text();
          console.error(`Second API call failed: ${response2.status}`, errorText);
        } catch (textError) {
          console.error(`Second API call failed: ${response2.status}`, "Could not read error text");
        }
        // Continue with empty data - we can still return bill data from first API
      }
    } catch (parseError) {
      console.error(`Error parsing second API response:`, parseError);
      // If second API fails, we can still return bill data if first API succeeded
      billStatusData = { data: [] };
    }

    // Return combined data
    return NextResponse.json({
      status: 1,
      billstatus: billStatusData?.data?.[0]?.billStatus || "Unknown",
      billstatusdata: billStatusData?.data?.[0] || null,
      data: billData.retailBillPrintingComplete[0] || billData.retailBillPrintingComplete,
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    const errorMessage = error.message || "Unknown error";
    const errorStack = error.stack || "";
    
    return NextResponse.json(
      {
        status: 0,
        message: "We are working on it. Please try again after a few moments.",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

