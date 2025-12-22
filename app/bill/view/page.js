"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import BillDisplay from "@/components/BillDisplay";
import PaymentModal from "@/components/PaymentModal";

function BillViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [billData, setBillData] = useState(null);
  const [billStatusData, setBillStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const consumerId = searchParams.get("consumerId");

  useEffect(() => {
    if (!consumerId) {
      setError("Consumer ID is required.");
      setLoading(false);
      return;
    }

    fetchBill();
  }, [consumerId]);

  const fetchBill = async () => {
    if (!consumerId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bill/get-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consumerId: consumerId.trim() }),
      });

      const data = await response.json();

      if (data.status === 1) {
        setBillData(data.data);
        setBillStatusData(data.billstatusdata);
        setError(null);
      } else {
        const errorMsg = data.message || "Please check your consumer ID.";
        const devError = data.error ? ` (${data.error})` : "";
        setError(errorMsg + devError);
        setBillData(null);
        setBillStatusData(null);
      }
    } catch (err) {
      console.error("Error fetching bill:", err);
      setError("We are working on it. Please try again after a few moments.");
      setBillData(null);
      setBillStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    if (!billData || !billStatusData) {
      setError("Bill data is missing. Please fetch the bill again.");
      return;
    }

    setPaymentProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/bill/payment-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: paymentData.mobileNumber,
          cnic: paymentData.cnic,
          consumerIdmodal: consumerId,
          consumerFormData: billStatusData,
        }),
      });

      const data = await response.json();

      if (data.status === 1) {
        setPaymentSuccess(true);
        setShowPaymentModal(false);
        // Refresh bill data to get updated payment status
        setTimeout(() => {
          fetchBill();
        }, 2000);
      } else {
        setError(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    const printDiv = document.getElementById("print-div");
    if (!printDiv) {
      setError("Bill display not found.");
      return;
    }

    try {
      setLoading(true);
      
      // Dynamically import html2canvas only on client side
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(printDiv, {
        scale: 4,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("portrait", "pt", "a4");

      const pdfWidth = 595.28;
      const pdfHeight = 841.89;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;

      const margin = 20;
      let width = pdfWidth - 2 * margin;
      let height = width / aspectRatio;

      if (height > pdfHeight - 2 * margin) {
        height = pdfHeight - 2 * margin;
        width = height * aspectRatio;
      }

      const xOffset = margin;
      const yOffset = (pdfHeight - height) / 2;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, width, height);
      
      // Get field value with fallback
      const getField = (fieldName) => {
        return billData?.[fieldName] || 
               billData?.[fieldName.toUpperCase()] || 
               billData?.[fieldName.toLowerCase()] || 
               "";
      };
      
      const consumerNo = getField("CONS_NO") || getField("conS_NO");
      const billPeriod = getField("BILL_PERIOD") || getField("bilL_PERIOD");
      const fileName = consumerNo
        ? `${consumerNo}-${billPeriod || "bill"}.pdf`
        : "bill.pdf";
      
      pdf.save(fileName);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printDiv = document.getElementById("print-div");
    if (!printDiv) {
      setError("Bill display not found.");
      return;
    }

    const printWindow = window.open("", "", "height=842,width=595");
    const printContent = printDiv.outerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { margin: 0; padding: 0; }
            #print-div { 
              width: 100%; 
              height: auto; 
              background-image: url('/BILL new.jpeg'); 
              background-repeat: no-repeat; 
              background-size: cover; 
            }
            @media print {
              html, body { width: 210mm; height: 297mm; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const handleBack = () => {
    router.push("/");
  };

  const isPaid = billStatusData?.billStatus === "Paid";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50 mb-4">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-700">Water Bill</h1>
            <button
              type="button"
              onClick={handleBack}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6 pt-4">
        {loading && !billData ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bill...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 text-lg mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
            >
              Go Back
            </button>
          </div>
        ) : billData ? (
          <div className="mt-2">
            {paymentSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Thank you! Your bill has been paid successfully.
              </div>
            )}
            <BillDisplay
              billData={billData}
              onBack={handleBack}
              onDownloadPDF={handleDownloadPDF}
              onPrint={handlePrint}
              onPay={() => setShowPaymentModal(true)}
              isPaid={isPaid}
            />
          </div>
        ) : null}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentSuccess(false);
        }}
        onSubmit={handlePaymentSubmit}
        isProcessing={paymentProcessing}
      />
    </div>
  );
}

export default function BillViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BillViewContent />
    </Suspense>
  );
}

