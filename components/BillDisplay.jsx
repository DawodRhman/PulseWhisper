"use client";

import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function BillDisplay({ billData, onBack, onDownloadPDF, onPrint, onPay, isPaid }) {
  const barcodeRef = useRef(null);
  const barcodeRef2 = useRef(null);

  useEffect(() => {
    // Generate barcodes when bill data is available
    const barcodeValue = billData?.CONSUMER_ID_CHK_DG || billData?.consumeR_ID_CHK_DG || billData?.BAR_CODE || billData?.baR_CODE;
    
    if (billData && barcodeValue) {
      try {
        if (barcodeRef.current) {
          JsBarcode(barcodeRef.current, barcodeValue, {
            format: "CODE128",
            lineColor: "#000000",
            background: "#ffffff",
            width: 2,
            height: 100,
            displayValue: false,
          });
        }
        if (barcodeRef2.current) {
          JsBarcode(barcodeRef2.current, barcodeValue, {
            format: "CODE128",
            lineColor: "#000000",
            background: "#ffffff",
            width: 2,
            height: 100,
            displayValue: false,
          });
        }
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [billData]);

  if (!billData) return null;

  // Format consumer number with spaces
  // Handle both uppercase and mixed case field names
  const formatConsumerNumber = (num, plotType) => {
    if (!num) return "";
    const str = num.toString();
    if (str.length >= 11) {
      return `${str.charAt(0)} ${str.substring(1, 4)} ${str.substring(4, 8)} ${str.substring(8, 11)} ${plotType || ""}`;
    }
    return str;
  };

  // Get field value with fallback for different case variations
  const getField = (fieldName) => {
    return billData[fieldName] || 
           billData[fieldName.toUpperCase()] || 
           billData[fieldName.toLowerCase()] || 
           "";
  };

  const consumerNumber = formatConsumerNumber(
    getField("CONS_NO") || getField("conS_NO") || "",
    getField("PLOT_TYPE") || getField("ploT_TYPE") || ""
  );

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownloadPDF();
          }}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Download Bill
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrint();
          }}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Print
        </button>
        {isPaid ? (
          <button
            type="button"
            disabled
            className="bg-green-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
          >
            Bill already paid
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPay();
            }}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition flex items-center gap-2"
          >
            Pay Via JazzCash
            <img
              src="/jazzcash.png"
              alt="JazzCash"
              className="h-5"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </button>
        )}
      </div>

      {/* Bill Display - Print Optimized */}
      <div
        id="print-div"
        className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg mx-auto"
        style={{
          width: "800px",
          maxWidth: "100%",
          backgroundImage: "url('/BILL new.jpeg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          minHeight: "1000px",
          position: "relative",
          margin: "0 auto",
          color: "#000000",
        }}
      >
        <style>{`
          #print-div * {
            color: #000000 !important;
          }
          #print-div .text-white {
            color: #ffffff !important;
          }
        `}</style>
        {/* Top Section */}
        <div className="relative" style={{ padding: "15px 25px" }}>
          {/* District/Town Name */}
          <div
            className="text-white font-bold"
            style={{ position: "relative", left: "25px", top: "15px", color: "#000000", zIndex: 10 }}
          >
            {getField("ZONE_NAME") || getField("zonE_NAME") || getField("TOWN_NAME") || getField("towN_NAME") || ""}
          </div>

          {/* Bill Type */}
          <div
            className="text-white font-bold"
            style={{ position: "relative", left: "580px", top: "-10px" }}
          >
            Monthly Bill
          </div>

          {/* Barcode - Top */}
          <div
            style={{
              position: "absolute",
              left: "180px",
              top: "90px",
              fontSize: "12px",
              width: "115px",
            }}
          >
            <img
              ref={barcodeRef}
              className="barcode"
              alt="Barcode"
              style={{
                width: "160px",
                position: "absolute",
                left: "-50px",
                top: "5px",
              }}
            />
          </div>

          {/* Consumer Number - Top */}
          <div
            style={{
              position: "relative",
              left: "324px",
              top: "56px",
              fontSize: "12px",
              color: "#000000",
              fontWeight: "bold",
              zIndex: 10,
            }}
          >
            {getField("CONSUMER_ID_CHK_DG") || getField("consumeR_ID_CHK_DG") || ""}
          </div>

          {/* Consumer Number - Main */}
          <div
            className="font-bold"
            style={{
              position: "relative",
              left: "125px",
              top: "58px",
              fontSize: "12px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            {consumerNumber}
          </div>

          {/* Consumer Name and Address */}
          <div
            className="font-bold"
            style={{
              position: "absolute",
              left: "25px",
              top: "162px",
              width: "310px",
              fontSize: "12px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <div>{getField("CONSUMER_NAME") || getField("consumeR_NAME") || ""}</div>
            <div>{getField("ADD1") || getField("adD1") || ""}</div>
            <div>{getField("ADD2") || getField("adD2") || ""}</div>
          </div>

          {/* Plot Details Table */}
          <table
            style={{
              position: "absolute",
              left: "16px",
              top: "235px",
              height: "22px",
              width: "283px",
              tableLayout: "fixed",
              fontSize: "12px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "33%", textAlign: "center", color: "#000000" }}>
                  {getField("PLOT_SIZE") || getField("ploT_SIZE") || ""}
                </td>
                <td style={{ width: "33%", textAlign: "center", color: "#000000" }}>
                  {getField("ADDITIONAL_STORY") || getField("additionaL_STORY") || ""}
                </td>
                <td style={{ width: "33%", textAlign: "center", color: "#000000" }}>
                  {getField("FLAT_SIZE") || getField("flaT_SIZE") || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Billing History Table */}
          <table
            style={{
              position: "absolute",
              left: "19px",
              top: "295px",
              width: "285px",
              fontSize: "11px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <tbody id="billing_history_table">
              {Array.from({ length: 12 }, (_, i) => {
                const month = 12 - i;
                const monthKey = `BILLING_MONTH_${month}`;
                const monthKeyAlt = `billinG_MONTH_${month}`;
                const billedKey = `AMOUNT_BILLED_${month}`;
                const billedKeyAlt = `amounT_BILLED_${month}`;
                const paidKey = `AMOUNT_PAID_${month}`;
                const paidKeyAlt = `amounT_PAID_${month}`;
                const dateKey = `PAYMENT_DATE_${month}`;
                const dateKeyAlt = `paymenT_DATE_${month}`;

                return (
                  <tr key={month} style={{ height: "16px" }}>
                    <td style={{ width: "25%", color: "#000000" }}>
                      {getField(monthKey) || getField(monthKeyAlt) || ""}
                    </td>
                    <td style={{ width: "25%", color: "#000000" }}>
                      {getField(billedKey) || getField(billedKeyAlt) || ""}
                    </td>
                    <td style={{ width: "25%", color: "#000000" }}>
                      {getField(paidKey) || getField(paidKeyAlt) || ""}
                    </td>
                    <td style={{ width: "25%", color: "#000000" }}>
                      {getField(dateKey) || getField(dateKeyAlt) || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Outstanding Arrears */}
          <table
            style={{
              position: "absolute",
              left: "308px",
              top: "463px",
              width: "381px",
              fontSize: "11px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <tbody>
              <tr style={{ height: "10px" }}>
                <td style={{ color: "#000000" }}>Outstanding Arrears =&gt;</td>
                <td style={{ color: "#000000" }}>Water : {getField("WATER_ARREARS") || getField("wateR_ARREARS") || "0"}</td>
                <td style={{ color: "#000000" }}>Sewerage : {getField("SEWERAGE_ARREARS") || getField("seweragE_ARREARS") || "0"}</td>
              </tr>
              <tr style={{ height: "10px" }}>
                <td style={{ color: "#000000" }}>Conservancy : {getField("CONSERVANCY_ARREARS") || getField("conservancY_ARREARS") || "0"}</td>
                <td style={{ color: "#000000" }}>Fire : {getField("FIRE_ARREARS") || getField("firE_ARREARS") || "0"}</td>
                <td style={{ color: "#000000" }}>Total : {getField("OUTSTANDING_ARREARS") || getField("outstandinG_ARREARS") || "0"}</td>
              </tr>
            </tbody>
          </table>

          {/* Consumer Name - Bottom */}
          <div
            className="font-bold"
            style={{
              position: "absolute",
              fontSize: "12px",
              left: "25px",
              top: "708px",
              width: "312px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <div style={{ color: "#000000" }}>{getField("CONSUMER_NAME") || getField("consumeR_NAME") || ""}</div>
            <div style={{ color: "#000000" }}>{getField("ADD1") || getField("adD1") || ""}</div>
            <div style={{ color: "#000000" }}>{getField("ADD2") || getField("adD2") || ""}</div>
          </div>
        </div>

        {/* Right Section - Charges */}
        <div className="relative">
          {/* Bill Period, Issue Date, Due Date */}
          <table
            style={{
              position: "absolute",
              bottom: "83.9%",
              width: "255px",
              fontSize: "12px",
              fontWeight: "900",
              right: "115px",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <tbody>
              <tr>
                <td style={{ paddingLeft: "15px", color: "#000000" }}>
                  {getField("BILL_PERIOD") || getField("bilL_PERIOD") || ""}
                </td>
                <td style={{ paddingLeft: "27px", color: "#000000" }}>
                  {getField("ISSU_DT") || getField("issU_DT") || ""}
                </td>
                <td style={{ paddingLeft: "15px", color: "#000000" }}>
                  {getField("DUE_DT") || getField("duE_DT") || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Town Code and Labels */}
          <table
            style={{
              position: "absolute",
              left: "38%",
              bottom: "67%",
              fontSize: "13px",
              width: "16%",
              height: "185px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    textAlign: "center",
                    fontWeight: "900",
                    top: "8px",
                    left: "0",
                    position: "absolute",
                    width: "125px",
                    fontSize: "10px",
                  }}
                >
                  {getField("TOWN_NAME") || getField("towN_NAME") || ""}
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "7px",
                    left: "5px",
                  }}
                >
                  Water
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "5px",
                  }}
                >
                  Sewerage
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-7px",
                    left: "5px",
                  }}
                >
                  Convencery
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: "5px",
                  }}
                >
                  Fire
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-23px",
                    left: "5px",
                  }}
                >
                  Bank Charges
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "5px",
                  }}
                >
                  Surcharge
                </td>
              </tr>
            </tbody>
          </table>

          {/* Charges Table */}
          <table
            style={{
              position: "absolute",
              left: "430px",
              top: "181px",
              width: "255px",
              height: "150px",
              fontSize: "10px",
              textAlign: "right",
              color: "#000000",
              zIndex: 10,
            }}
          >
            <tbody>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px", color: "#000000" }}>
                  {getField("WATER_CURRENT") || getField("wateR_CURRENT") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px", color: "#000000" }}>
                  {getField("WATER_ARREAR") || getField("wateR_ARREAR") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px", color: "#000000" }}>
                  {getField("TOTAL_WATER") || getField("totaL_WATER") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("SEWERAGE_CURRENT") || getField("seweragE_CURRENT") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("SEWWRAGE_ARREAR") || getField("sewwragE_ARREAR") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("TOTAL_SEWERAGE") || getField("totaL_SEWERAGE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("CONSERVANCY_CURRENT") || getField("conservancY_CURRENT") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("CONSERVANCY_ARREAR") || getField("conservancY_ARREAR") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("TOTAL_CONSERVANCY") || getField("totaL_CONSERVANCY") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("FIRE_CURRENT") || getField("firE_CURRENT") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("FIRE_ARREAR") || getField("firE_ARREAR") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("TOTAL_FIRE") || getField("totaL_FIRE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("BANK_CHARGES") || getField("banK_CHARGES") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td
                  style={{
                    width: "33.33%",
                    fontWeight: "900",
                    paddingRight: "5px",
                  }}
                >
                  {getField("PAYABLE_DUE_DATE") || getField("payablE_DUE_DATE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("WATER_SURCHARGE") || getField("wateR_SURCHARGE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    fontWeight: "900",
                  }}
                >
                  {getField("PAYABLE_AFTER_DATE") || getField("payablE_AFTER_DATE") || "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Section - Duplicate */}
        <div className="relative">
          {/* Consumer Number - Bottom */}
          <div
            className="font-bold"
            style={{
              position: "relative",
              left: "165px",
              top: "602px",
              fontSize: "12px",
            }}
          >
            {consumerNumber}
          </div>

          {/* Bill Period - Bottom */}
          <table
            style={{
              position: "absolute",
              left: "53.8%",
              bottom: "33.5%",
              fontSize: "12px",
              width: "256px",
              fontWeight: "900",
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "33.33%", textAlign: "center" }}>
                  {getField("BILL_PERIOD") || getField("bilL_PERIOD") || ""}
                </td>
                <td style={{ width: "33.33%", textAlign: "center" }}>
                  {getField("ISSU_DT") || getField("issU_DT") || ""}
                </td>
                <td style={{ width: "33.33%", textAlign: "center" }}>
                  {getField("DUE_DT") || getField("duE_DT") || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Town Code - Bottom */}
          <table
            style={{
              position: "absolute",
              left: "38%",
              bottom: "17.8%",
              fontSize: "14px",
              width: "16%",
              height: "175px",
            }}
          >
            <tbody>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    textAlign: "center",
                    fontWeight: "900",
                    top: "8px",
                    left: "0px",
                    position: "absolute",
                    width: "125px",
                    fontSize: "10px",
                  }}
                >
                  {getField("TOWN_NAME") || getField("towN_NAME") || "TOWN CODE"}
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "5px",
                  }}
                >
                  Water
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "7px",
                    left: "5px",
                  }}
                >
                  Sewerage
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "5px",
                  }}
                >
                  Convencery
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-5px",
                    left: "5px",
                  }}
                >
                  Fire
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "-11px",
                    left: "5px",
                  }}
                >
                  Bank Charges
                </td>
              </tr>
              <tr style={{ position: "relative" }}>
                <td
                  style={{
                    position: "absolute",
                    top: "1px",
                    left: "5px",
                  }}
                >
                  Surcharge
                </td>
              </tr>
            </tbody>
          </table>

          {/* Charges Table - Bottom */}
          <table
            style={{
              position: "absolute",
              left: "430px",
              top: "685px",
              width: "255px",
              height: "153px",
              fontSize: "10px",
              textAlign: "right",
            }}
          >
            <tbody>
              <tr style={{ height: "16px" }}>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("WATER_CURRENT") || getField("wateR_CURRENT") || "0"}
                </td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("WATER_ARREAR") || getField("wateR_ARREAR") || "0"}
                </td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("TOTAL_WATER") || getField("totaL_WATER") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("SEWERAGE_CURRENT") || getField("seweragE_CURRENT") || "0"}
                </td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("SEWWRAGE_ARREAR") || getField("sewwragE_ARREAR") || "0"}
                </td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("TOTAL_SEWERAGE") || getField("totaL_SEWERAGE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("CONSERVANCY_CURRENT") || getField("conservancY_CURRENT") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("CONSERVANCY_ARREAR") || getField("conservancY_ARREAR") || "0"}
                </td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("TOTAL_CONSERVANCY") || getField("totaL_CONSERVANCY") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("FIRE_CURRENT") || getField("firE_CURRENT") || "0"}
                </td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("FIRE_ARREAR") || getField("firE_ARREAR") || "0"}
                </td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("TOTAL_FIRE") || getField("totaL_FIRE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("BANK_CHARGES") || getField("banK_CHARGES") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                ></td>
                <td
                  style={{
                    width: "33.33%",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                ></td>
                <td
                  style={{
                    width: "33.33%",
                    fontWeight: "900",
                    paddingRight: "5px",
                    height: "21px",
                  }}
                >
                  {getField("PAYABLE_DUE_DATE") || getField("payablE_DUE_DATE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}>
                  {getField("WATER_SURCHARGE") || getField("wateR_SURCHARGE") || "0"}
                </td>
              </tr>
              <tr style={{ height: "16px" }}>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td style={{ width: "33.33%", paddingRight: "5px" }}></td>
                <td
                  style={{
                    width: "33.33%",
                    fontWeight: "900",
                    paddingRight: "5px",
                  }}
                >
                  {getField("PAYABLE_AFTER_DATE") || getField("payablE_AFTER_DATE") || "0"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Consumer ID - Bottom */}
          <div
            style={{
              position: "relative",
              left: "474px",
              top: "736px",
              fontSize: "12px",
              display: "inline-block",
            }}
          >
            {getField("CONSUMER_ID_CHK_DG") || getField("consumeR_ID_CHK_DG") || ""}
          </div>

          {/* Bank CD Code */}
          <div
            style={{
              position: "absolute",
              left: "622px",
              top: "843px",
              textAlign: "left",
              display: "inline-block",
              fontSize: "12px",
            }}
          >
            {getField("BILLING_PERIOD_CHK") || getField("billinG_PERIOD_CHK") || ""}
          </div>

          {/* Barcode - Bottom */}
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: "868px",
              width: "498px",
              textAlign: "center",
              height: "99px",
            }}
          >
            <img
              ref={barcodeRef2}
              className="barcode"
              alt="Barcode"
              style={{
                width: "60%",
                paddingTop: "8px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

