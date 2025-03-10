"use client";

require("dotenv").config();

import Image from "next/image";
import { use, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { load } from "@cashfreepayments/cashfree-js";

import {
  collection,
  addDoc,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";

const initializeSDK = async () => {
  const cashfree = await load({ mode: "sandbox" });
  return cashfree;
};

const db = getFirestore(app);

async function addDatatoFireStore(
  firstname,
  email,
  mobileno,
  pincode,
  address,
  city
) {
  try {
    const docRef = await addDoc(collection(db, "devotees"), {
      firstname: firstname,
      email: email,
      mobileno: mobileno,
      pincode: pincode,
      address: address,
      city: city,
    });
    console.log("Data Added with Ref ID: ", docRef.id);
    return [true, docRef.id];
  } catch (error) {
    console.error("Error while addding Data ", error);
    return [false, ""];
  }
}

const getDocuments = async () => {
  //console.log("started");

  const dRef = collection(db, "devotees");
  const q = query(
    dRef,
    where("mobileno", "!=", ""),
    orderBy("mobileno", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    console.log(doc.id);
  });

  [7, 7.5, -7.2345].forEach((myNumber) => {
    let formattedNumber = myNumber.toLocaleString("en-US", {
      minimumIntegerDigits: 5,
      useGrouping: false,
    });
    console.log(
      "Input:    " + myNumber + "\n" + "Output:   " + formattedNumber
    );
  });
};

const updateDocs = async () => {
  const docRef = doc(db, "counters", "doc_counters");
  //console.log(doc.Field)
  const qSnap = await getDoc(docRef);
  const newID = qSnap.data().d_id + 1;
  console.log(qSnap.data());
  console.log(newID);
  await updateDoc(docRef, { d_id: newID });
};

export default function Home() {
  const [docRef, setDocRef] = useState("");

  const [firstname, setfirstname] = useState("");
  const [email, setemail] = useState("");
  const [mobileno, setmobileno] = useState("");
  const [pincode, setpincode] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [sessionid, setSessionID] = useState("");

  /*
  const options = {
    method: "POST",
    headers: {
      "x-api-version": "2023-08-01",
      "x-client-id": process.env.Cashfree_ClientID,
      "x-client-secret": process.env.Cashfree_ClientSecret,
    },
    body: '{"order_currency":"INR","orderamount":10.34,"customer_details":{"customer_id":"7112AAA812234","customer_phone":"9898989898"}}',
  };
*/
  const getPayOrder = async () => {
    const response = await fetch("/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: '{"order_currency":"INR","orderamount":200,"customer_details":{"customer_id":"7112AAA812234","customer_phone":"9898989898"}}',
    });

    if (response) {
      const data = await response.json();
      console.log(data);
      if (!data.success) {
        alert("Failed to initiate payment. Please try again.");
        return;
      }

      console.log("Session ID:", data.data.payment_session_id);
      setSessionID(data.data.payment_session_id);
    }
  };

  const handleRedirect = async () => {
    const cashfree = await initializeSDK();

    let checkoutOptions = {
      paymentSessionId: sessionid,
      returnUrl: "https://sunsoftwares.info",
    };
    cashfree.checkout(checkoutOptions).then(function (result) {
      if (result.error) {
        alert(result.error.message);
      }
      if (result.redirect) {
        console.log("Redirection");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [r1, r2] = await addDatatoFireStore(
      firstname,
      email,
      mobileno,
      pincode,
      address,
      city
    );
    if (r1) {
      setfirstname("");
      setaddress("");
      setemail("");
      setmobileno("");
      setpincode("");
      setcity("");
      alert("Data Added Successfully....");
      alert(r2);
    }
  };

  return (
    <section>
      <div className="flex flex-col bg-white items-center">
        <div className="block mb-1 text-lg font-bold p-2.5">
          THAMBILA SEVA BOOKING
        </div>
        <form onSubmit={handleSubmit} className="w-auto">
          <div className="lg:mb-6">
            <label
              htmlFor="firstname"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white p-0"
            >
              Devotee Full Name
            </label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Devotee Name"
              required
            />
          </div>
          <div className="grid md:gap-6 gap-1 md:mb-2 md:grid-cols-2">
            <div>
              <label
                htmlFor="mobileno"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Mobile No.
              </label>
              <input
                onInput={(e) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(
                      0,
                      e.target.maxLength
                    );
                }}
                type="tel"
                id="mobileno"
                maxLength={10}
                value={mobileno}
                onChange={(e) => setmobileno(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Mobile No"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Pin Code
              </label>
              <input
                onInput={(e) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(
                      0,
                      e.target.maxLength
                    );
                }}
                type="number"
                id="pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setpincode(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Postal Code"
                required
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Area/City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setcity(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Area or City"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-1 text-sm md:text-base font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="eMail Address"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="seva"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ಸೇವೆಯ ಹೆಸರು
            </label>
            <input
              type="text"
              id="seva"
              className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              value="ತಂಬಿಲ ಸೇವೆ - ರೂ.200.00"
              disabled
            />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        <button onClick={getDocuments}>Test Data</button>
        <button onClick={updateDocs}>Update Data</button>
        <button onClick={getPayOrder}>Create Order</button>
        <button onClick={handleRedirect}>Pay Now</button>
      </div>
      <div className="flex w-full max-h-48">
        <iframe
          name="cashfree_iframe"
          title="Cashfree"
          className="flex flex-grow p-2"
        ></iframe>
      </div>
    </section>
  );
}
