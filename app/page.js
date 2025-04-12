"use client";

import { useFormStatus } from "react-dom";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";

import {
  collection,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";

const db = getFirestore(app);

const getDetByMobNo = async (sMobile) => {
  try {
    const dRef = collection(db, "devotees");
    const q = query(
      dRef,
      where("mobileno", "==", sMobile),
      orderBy("mobileno", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    let data = [];
    if (snapshot.empty) {
      console.log("Mobile Not found...");
      return 0;
    } else {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { data };
    }
  } catch (error) {
    console.error("Error while addding Data ", error);
    return 0;
  }
};

export default function Home() {
  const router = useRouter();
  const { pending } = useFormStatus();

  const [sMobile, setsMobile] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const r1 = await getDetByMobNo(sMobile);
    console.log("result data:", r1);
    if (r1 == 0) {
      //console.log("Not Registered yet");
      router.push("/register/" + `${sMobile}`);
    } else {
      //console.log(r1.data[0].id);
      router.push("/seva/booking/" + `${r1.data[0].id}`);
    }
  };

  return (
    <section>
      <div className="flex flex-col bg-white items-center">
        <div className="block mb-1 text-lg font-bold p-2.5">
          THAMBILA SEVA BOOKING
        </div>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <label
            htmlFor="phone-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mobile Number:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 19 18"
              >
                <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
              </svg>
            </div>
            <input
              onInput={(e) => {
                if (e.target.value.length > e.target.maxLength)
                  e.target.value = e.target.value.slice(0, e.target.maxLength);
              }}
              type="tel"
              id="sMobile"
              maxLength={10}
              aria-describedby="helper-text-explanation"
              onChange={(e) => setsMobile(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              pattern="[0-9]{10}"
              placeholder="Mobile Number"
              required
            />
          </div>
          <p
            id="helper-text-explanation"
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          ></p>
          <button
            type="submit"
            className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            {pending ? "loading..." : "Continue"}
          </button>
        </form>
      </div>
    </section>
  );
}
