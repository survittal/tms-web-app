"use client";

import { getSevaDetByDocID, shortDate } from "@/app/db/devotee";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdfviewer"), {
  ssr: false,
});

const PDFDownloadLink = dynamic(() => import("./pdfDownloadLink"), {
  ssr: false,
});

export default function PrintComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);

  const pDocID = searchParams.get("id1");
  const sDocID = searchParams.get("id2");

  useEffect(() => {
    if (!(pDocID == null) && !(sDocID == null)) {
      getSevaDetByDocID(pDocID, sDocID).then(function (result) {
        console.log("printing:", result);
        setData({ mID: pDocID, ...result });
      });
    }
  }, []);

  const handleClick = () => {
    router.push("/");
  };

  const ReceiptPage = () => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", lineHeight: "150%" }}
          >
            VAIDYANATHA MALARAYA SAPARIVARA DAIVASTHANA
          </Text>
          <Text style={{ fontSize: 14 }}>
            MALARAYA JERA, DHARMA NAGARA, KAMBALABETTU - 574243
          </Text>
          <Text style={{ fontSize: 13 }}>
            Mobile: +91 636041602, eMail: malarayajera@gmail.com
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              lineHeight: "150%",
              marginTop: 10,
              textDecoration: "underline",
            }}
          >
            RECEIPT
          </Text>
        </View>
        <View style={[styles.section, { marginBottom: 5 }]}>
          <View style={[styles.section1, { width: "65%" }]}>
            <Text style={{ color: "gray" }}>Receipt No.:</Text>
            <Text>{data.receipt_no}</Text>
          </View>
          <View style={[styles.section1, { width: "25%" }]}>
            <Text style={{ color: "gray" }}>Receipt Date :</Text>
            <Text>{data.bill_date}</Text>
          </View>
        </View>
        <View style={[styles.section, { marginBottom: 4 }]}>
          <View style={[styles.section1, { width: "65%" }]}>
            <Text style={{ color: "gray" }}>Devotee Name : </Text>
            <Text style={{ color: "black" }}>{data.devotee_name}</Text>
          </View>
          <View style={[styles.section1, { width: "25%" }]}>
            <Text style={{ color: "gray" }}>Mobile : </Text>
            <Text>{data.cust_mob}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 10,
            padding: 4,
            borderBottom: "1px solid black",
            borderTop: "1px solid black",
          }}
        >
          <View style={{ width: "10%" }}>
            <Text>Sl.No.</Text>
          </View>
          <View style={{ width: "35%" }}>
            <Text>Description of Receipt</Text>
          </View>
          <View style={{ width: "15%", alignItems: "center" }}>
            <Text>{data.seva_name === "Thambila" ? "Months" : "Sq.ft."}</Text>
          </View>
          <View style={{ width: "15%", alignItems: "flex-end" }}>
            <Text>
              {data.seva_name === "Thambila" ? "Seva Price" : "Price/Sq.ft."}
            </Text>
          </View>
          <View style={{ width: "20%", alignItems: "flex-end" }}>
            <Text>Total Amount</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 10,
            padding: 4,
          }}
        >
          <View style={{ width: "10%" }}>
            <Text>1</Text>
          </View>
          <View style={{ width: "35%" }}>
            <Text>{data.seva_desc}</Text>
          </View>
          <View style={{ width: "15%", alignItems: "center" }}>
            <Text>{data.total_months}</Text>
          </View>
          <View style={{ width: "15%", alignItems: "flex-end" }}>
            <Text>{data.seva_price}</Text>
          </View>
          <View style={{ width: "20%", alignItems: "flex-end" }}>
            <Text>{data.total_amount}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 10,
            padding: 5,
            borderTop: "2px solid black",
          }}
        >
          <View style={{ width: "60%", marginLeft: 10 }}>
            <Text style={{ color: "gray", fontSize: 12 }}>
              Amount in Words:
            </Text>
            <Text>{inWords(parseFloat(data.total_amount))}</Text>
          </View>
          <View style={{ width: "32%", alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              TOTAL : {data.total_amount}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "table",
            flexDirection: "row",
            width: "95%",
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 12 }}>Payment Method: Online</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12 }}>Trn.Ref.No.: {data.trn_ref}</Text>
          </View>
        </View>
        <View style={styles.header}>
          <Text style={{ fontSize: 12, color: "gray" }}>
            This Receipt is printed electronically, so no signature is required.{" "}
          </Text>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: {
      padding: "12px",
      height: "100px",
    },
    header: {
      textAlign: "center",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      gap: "5px",
      margin: 1,
      padding: 1,
    },
    section1: {
      display: "flex",
      flexDirection: "row",
      gap: "5px",
      margin: 1,
      padding: 1,
    },
    logo: {
      width: 70,
      height: 70,
      marginTop: "15px",
    },
  });

  function inWords(value) {
    var fraction = Math.round(frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
      f_text = "And " + convert_number(fraction) + " Paise";
    }
    return convert_number(value) + " Rupee " + f_text + "Only";
  }

  function frac(f) {
    return f % 1;
  }

  function convert_number(number) {
    if (number < 0 || number > 999999999) {
      return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000); /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000); /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000); /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100); /* Tens (deca) */
    number = number % 100; /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
      res += convert_number(Gn) + " Crore";
    }
    if (kn > 0) {
      res += (res == "" ? "" : " ") + convert_number(kn) + " Lakh";
    }
    if (Hn > 0) {
      res += (res == "" ? "" : " ") + convert_number(Hn) + " Thousand";
    }

    if (Dn) {
      res += (res == "" ? "" : " ") + convert_number(Dn) + " Hundred";
    }

    var ones = Array(
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nin",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen"
    );
    var tens = Array(
      "",
      "",
      "Twenty",
      "Thirty",
      "Fourty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety"
    );

    if (tn > 0 || one > 0) {
      if (!(res == "")) {
        res += " And ";
      }
      if (tn < 2) {
        res += ones[tn * 10 + one];
      } else {
        res += tens[tn];
        if (one > 0) {
          res += "-" + ones[one];
        }
      }
    }

    if (res == "") {
      res = "zero";
    }
    return res;
  }

  return (
    <>
      {!(data == "") ? (
        <div className="max-w-2xl mx-auto my-10">
          <div className="w-full h-[400px]">
            <PDFViewer width="100%" height="100%">
              <ReceiptPage />
            </PDFViewer>
          </div>
          <div className="mt-6 flex justify-center">
            <PDFDownloadLink document={<ReceiptPage />} fileName="invoice.pdf">
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Download Receipt
              </button>
            </PDFDownloadLink>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleClick}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Back to Main
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>Processing ... Or No Data Found</div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleClick}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
