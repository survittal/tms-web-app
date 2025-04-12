"use client";
import { use, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDetByDocID } from "../../../db/devotee";
import { getFirestore } from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { load } from "@cashfreepayments/cashfree-js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const initializeSDK = async () => {
  const cashfree = await load({ mode: process.env.NEXT_PUBLIC_Cashfree_Env }); //
  return cashfree;
};

const db = getFirestore(app);

export default function Booking({ params }) {
  const { id } = use(params);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalmonths, setTotalmonths] = useState("1");
  const [totalamount, setTotalamount] = useState("200.00");
  const [sessionid, setSessionID] = useState("");
  const [orderId, setorderId] = useState("");
  const [docRefs, setDocRefs] = useState("");

  useEffect(() => {
    getDetByDocID(id).then(function (result) {
      setData(result);
      setLoading(false);
    });
  }, []);

  const getPayOrder = async (dRef) => {
    const response = await fetch("/cashfree/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body:
        '{"order_currency":"INR","orderamount":' +
        totalamount +
        ',"customer_details":{"customer_id":"7112AAA812234","customer_phone":"' +
        data.mobileno +
        '","customer_name":"' +
        data.firstname +
        '","customer_email":"' +
        data.email +
        '"}}',
    });

    if (response) {
      const result = await response.json();

      //console.log("order response:", result);

      if (!result.success) {
        alert("Failed to initiate payment. Please try again.");
        return;
      }

      setSessionID(result.data.payment_session_id);
      setorderId(result.data.order_id);
      console.log("getPayorder:", dRef);
      initiatePayment(result.data, dRef);
    }
  };

  const initiatePayment = async (reqData, dRef) => {
    //alert(reqData.order_id);

    try {
      const cashfree = await initializeSDK();

      let checkoutOptions = {
        paymentSessionId: reqData.payment_session_id,
        redirectTarget: "_modal",
      };
      cashfree.checkout(checkoutOptions).then((result) => {
        console.log(result);

        if (result.error) {
          alert(result.error.message);
        }
        /*
        if (result.redirect) {
          //alert("Redirection");
          //alert("Order ID : ", reqData.order_id);
        }
*/
        verifyPayment(reqData.order_id, dRef);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (orderId, dRef) => {
    //console.log(orderId);

    const response = await fetch("/cashfree/verifystatus", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: '{"order_id":"' + orderId + '", "cust_name":"surendra"}',
    });

    if (response) {
      const result_data = await response.json();

      //console.log("Final REsult", result_data.data);
      //alert("Payment verified...");

      addPaymentDet(result_data, dRef);
      redirect("/");
    }
  };

  const addPaymentDet = async (data, dRef) => {
    try {
      //console.log("new docment ref:", dRef);
      const docRef = await addDoc(collection(db, dRef), {
        order_id: data.data.order_id,
        order_date: data.data.created_at,
        order_amount: data.data.order_amount,
        order_status: data.data.order_status,
        order_note: data.data.order_note,
        pay_method: data.data.order_meta.payment_methods,
        payment_session_id: data.data.payment_session_id,
      });
      console.log("Final ID", docRef.id);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const calcTotalAmount = (months) => {
    setTotalmonths(months);
    let totamt = months * 200;
    setTotalamount(totamt.toFixed(2));
  };

  const zeroPad = (num, places) => String(num).padStart(places, "0");

  const addSevaDet = async () => {
    try {
      const docRef1 = doc(db, "counters", "doc_counters");
      const qSnap = await getDoc(docRef1);
      const newRNo = qSnap.data().r_no + 1;
      await updateDoc(docRef1, { r_no: newRNo });

      let rNum;

      rNum = new Date().getFullYear() + zeroPad(newRNo, 5);

      const docRef = await addDoc(
        collection(db, "devotees/" + id + "/sevadet"),
        {
          receipt_no: rNum,
          devotee_name: data.firstname,
          seva_name: "Thambila Seva",
          seva_price: 200,
          total_months: totalmonths,
          total_amount: totalamount,
        }
      );
      let newDocRef =
        "devotees/" + id + "/sevadet/" + docRef.id + "/paymentdet";
      console.log("Created Ref:", newDocRef);
      setDocRefs(newDocRef);
      getPayOrder(newDocRef);
      //alert("Seva Booking Completed...", docRef.id);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center">
        <div className="block mb-3 text-lg font-bold p-2.5">
          THAMBILA SEVA BOOKING
        </div>
        <form className="w-auto">
          <div className="grid grid-cols-1 gap-3 mb-2">
            <div>
              <label
                htmlFor="devotee"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white p-0"
              >
                Devotee Name
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="devotee"
                value={data.firstname || ""}
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="seva_name"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white p-0"
              >
                Seva Description
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="seva_name"
                value="Thambila Seva - Rs.200"
                disabled
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-1">
            <div>
              <label
                htmlFor="seva_months"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white p-0"
              >
                Total Months
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="number"
                id="seva_months"
                value={totalmonths}
                onChange={(e) => calcTotalAmount(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="total_amount"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white p-0"
              >
                Amount to Pay
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm text-right rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="number"
                id="total_amount"
                value={totalamount}
                disabled
              />
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-row mt-4 justify-between gap-3">
        <button
          className="block bg-blue-600 rounded-sm text-blue-50 p-2"
          onClick={addSevaDet}
        >
          {loading ? "Loading ...." : "Book and Pay"}
        </button>
        <Link
          className="block bg-blue-600 rounded-sm text-blue-50 p-2"
          href="/"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
