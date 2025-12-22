import { NextResponse } from "next/server";
import crypto from "crypto";
import { fetchWithSSLBypass } from "@/lib/bill/api-client";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      mobileNumber,
      cnic,
      consumerIdmodal,
      consumerFormData,
    } = body;

    // Validate required fields
    if (!mobileNumber || !cnic || !consumerIdmodal || !consumerFormData) {
      return NextResponse.json(
        { status: 0, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Get JazzCash credentials from environment variables
    const merchantID = process.env.JAZZCASH_MERCHANT_ID || "MC110717";
    const password = process.env.JAZZCASH_PASSWORD || "120027t3xy";
    const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT || "3264xd8w2y";
    const apiUrl = process.env.JAZZCASH_API_URL || "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction";
    const inquiryUrl = process.env.JAZZCASH_INQUIRY_URL || "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/PaymentInquiry/Inquire";
    const returnURL = process.env.JAZZCASH_RETURN_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Extract last 6 digits of CNIC
    const last_six_digits_cnic = cnic.replace(/-/g, "").slice(-6);

    // Calculate amount based on due date
    const currentTime = new Date();
    const dueDate = new Date(consumerFormData.dueDate);
    
    let amountStart = 0;
    let surcharge = 0;
    
    if (currentTime <= dueDate) {
      surcharge = 0;
      amountStart = consumerFormData.amountBeforeDueDate || 0;
    } else {
      surcharge = consumerFormData.surcharge || 0;
      amountStart = consumerFormData.amountAfterDueDate || 0;
    }

    // Prepare transaction details
    const amount = Math.round(amountStart * 100); // Amount in paisa
    const billReference = `bilRefWeb${consumerIdmodal}`;
    const description = `KWSC - Monthly Water Bill Payment of consumer ${consumerIdmodal}`;
    const language = "EN";
    const txnCurrency = "PKR";
    // Format: YYYYMMDDHHMMSS
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const txnDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const expYear = expiryDate.getFullYear();
    const expMonth = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const expDay = String(expiryDate.getDate()).padStart(2, "0");
    const expHours = String(expiryDate.getHours()).padStart(2, "0");
    const expMinutes = String(expiryDate.getMinutes()).padStart(2, "0");
    const expSeconds = String(expiryDate.getSeconds()).padStart(2, "0");
    const txnExpiryDateTime = `${expYear}${expMonth}${expDay}${expHours}${expMinutes}${expSeconds}`;

    // Generate reference number
    const consumerNumberWithoutAlpha = consumerIdmodal.replace(/[^0-9]/g, "");
    // Format: ydHs (year day hour second)
    const now = new Date();
    const yearDay = String(now.getFullYear()).slice(-1) + String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const currentDateTime = yearDay + hour + second;
    let referenceNumber = `TR${consumerNumberWithoutAlpha}${currentDateTime}`;
    referenceNumber = referenceNumber.padEnd(20, "0");
    const txnRefNo = referenceNumber;

    // Prepare secure hash
    const hashString = `${integritySalt}&${amount}&${billReference}&${last_six_digits_cnic}&${description}&${language}&${merchantID}&${mobileNumber}&${password}&${txnCurrency}&${txnDateTime}&${txnExpiryDateTime}&${txnRefNo}`;
    const secureHash = crypto
      .createHmac("sha256", integritySalt)
      .update(hashString)
      .digest("hex");

    // Prepare API request payload
    const requestPayload = {
      pp_Amount: amount,
      pp_BillReference: billReference,
      pp_CNIC: last_six_digits_cnic,
      pp_Description: description,
      pp_Language: language,
      pp_MerchantID: merchantID,
      pp_MobileNumber: mobileNumber,
      pp_Password: password,
      pp_SecureHash: secureHash,
      pp_TxnCurrency: txnCurrency,
      pp_TxnDateTime: txnDateTime,
      pp_TxnExpiryDateTime: txnExpiryDateTime,
      pp_TxnRefNo: txnRefNo,
      pp_ReturnURL: returnURL,
    };

    // Make JazzCash API call
    const jazzResponse = await fetchWithSSLBypass(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const jazzResponseData = await jazzResponse.json();

    if (jazzResponseData.pp_ResponseCode !== "000") {
      return NextResponse.json({
        status: 0,
        message: "Transaction is pending.",
      });
    }

    // Status Inquiry API
    const hashStringInquiry = `${integritySalt}&${merchantID}&${password}&${txnRefNo}`;
    const secureHashInquiry = crypto
      .createHmac("sha256", integritySalt)
      .update(hashStringInquiry)
      .digest("hex");

    const requestPayloadInquiry = {
      pp_MerchantID: merchantID,
      pp_Password: password,
      pp_SecureHash: secureHashInquiry,
      pp_TxnRefNo: txnRefNo,
    };

    const inquiryResponse = await fetchWithSSLBypass(inquiryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayloadInquiry),
    });

    const inquiryResponseData = await inquiryResponse.json();

    if (inquiryResponseData.pp_ResponseCode !== "000") {
      return NextResponse.json({
        status: 0,
        message: "Something didn't go quite as planned. Please give it another try!",
      });
    }

    // Post Payment API
    const postPaymentApiUrl = process.env.KWSC_API_BASE_URL 
      ? `${process.env.KWSC_API_BASE_URL}/api/BankCollection/PaymentConsumerBill`
      : "https://kwsconline.com:5000/api/BankCollection/PaymentConsumerBill";

    const postData = {
      consumerNo: consumerFormData.consumerNo,
      billingMonth: consumerFormData.billingMonth,
      paymentDate: new Date().toISOString(),
      transferDate: new Date().toISOString(),
      waterCurrent: consumerFormData.waterCurrent,
      sewerageCurrent: consumerFormData.sewerageCurrent,
      conservancyCurrent: consumerFormData.conservancyCurrent,
      fireCurrent: consumerFormData.fireCurrent,
      waterArrear: consumerFormData.waterArrear,
      sewerageArrear: consumerFormData.sewerageArrear,
      conservancyArrear: consumerFormData.conservancyArrear,
      fireArrear: consumerFormData.fireArrear,
      bankCharges: consumerFormData.bankCharges,
      amountBeforeDueDate: consumerFormData.amountBeforeDueDate,
      surcharge: surcharge,
      amountAfterDueDate: consumerFormData.amountAfterDueDate,
      bankId: "R",
      branchCode: "1",
      scrollId: txnRefNo,
      bankCDCode: consumerFormData.bankCDCode,
      consumerCDCode: consumerFormData.consumerCDCode,
      userName: process.env.KWSC_API_USERNAME || "websiteapikw@sc",
      password: process.env.KWSC_API_PASSWORD || "kW@$c!#$&",
    };

    const postPaymentResponse = await fetchWithSSLBypass(postPaymentApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const postPaymentData = await postPaymentResponse.json();

    if (postPaymentData.status === "Success") {
      return NextResponse.json({
        status: 1,
        message: "Bill successfully paid.",
      });
    } else {
      return NextResponse.json({
        status: 0,
        message: "Something didn't go quite as planned. Please give it another try!",
      });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      {
        status: 0,
        message: "Something went wrong. Please try again",
      },
      { status: 500 }
    );
  }
}

