"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getDetByDocID,
  getAllSeva,
  getSevaDetByDocID,
  addNewSevaDet,
} from "../../../db/devotee";
import PayButton from "@/app/cashfree/PayButton";
import { useRouter } from "next/navigation";

export default function Booking({ params }) {
  const router = useRouter();

  const { id } = use(params);
  const [sevaData, setSevaData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalmonths, setTotalmonths] = useState("1");
  const [sevaPrice, setSevaPrice] = useState("200.00");
  const [totalAmount, setTotalamount] = useState("200.00");
  const [ordStatus, setOrdStatus] = useState("Unpaid");
  const [sDocRef, setDocRef] = useState("");
  const [sevaType, setSevaType] = useState("Thambila");
  const [sevaDesc, setSevaDesc] = useState("Sankramana Thambila");
  const [devoteeName, setDevoteeName] = useState("");

  useEffect(() => {
    getDetByDocID(id).then(function (result) {
      setData(result);
      setDevoteeName(result.firstname);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getAllSeva(id).then(function (rData) {
      setSevaData(rData.data);
      setLoading(false);
    });
  }, []);

  const handleClick = () => {
    router.push("/");
  };

  const getSevaDetails = (idNum) => {
    getSevaDetByDocID(id, idNum).then(function (result) {
      console.log("Seva Result:", result);
      setTotalmonths(result.total_months);
      setTotalamount(result.total_amount);
      setOrdStatus(result.order_status);
      setDocRef(result.id);
      if (result.seva_name === "Thambila Seva") {
        setSevaType("Thambila");
        setSevaDesc("Sankramana Thambila");
      } else {
        setSevaType("Donation");
        setSevaDesc("Bhoo Dhana Donation");
      }
      calcTotalAmount(result.total_months);
      setData({
        sevaRefId: result.id,
        totAmount: result.total_amount,
        ...data,
      });
    });
  };

  const calcTotalAmount = (months) => {
    if (months <= 0) months = 1;
    setTotalmonths(months);
    let totAmt = 0;
    if (sevaType === "Thambila") {
      setSevaPrice(200);
      setSevaType("Thambila");
      setSevaDesc("Sankramana Thambila");
      totAmt = months * 200;
    } else {
      setSevaPrice(1000);
      setSevaType("Donation");
      setSevaDesc("Bhoo Dhana Donation");
      totAmt = months * 1000;
    }
    setTotalamount(parseFloat(totAmt).toFixed(2));
  };

  const addSevaDet = async () => {
    const today = new Date();
    const newRefId = await addNewSevaDet(id, {
      devotee_name: devoteeName,
      seva_name: sevaType,
      seva_desc: sevaDesc,
      seva_price: sevaPrice,
      total_months: totalmonths,
      total_amount: totalAmount,
      order_status: "Unpaid",
      bill_date: today.toLocaleDateString(),
    });
    setData({ sevaRefId: newRefId.id, totAmount: totalAmount, ...data });
    setDocRef(newRefId.id);
  };

  const handleOptionChange = (value) => {
    if (value === "Thambila") {
      setTotalmonths(1);
      let totAmt = 200;
      setSevaPrice(200);
      setTotalamount(totAmt.toFixed(2));
    } else {
      setTotalmonths(1);
      let totAmt = 1000;
      setSevaPrice(1000);
      setTotalamount(totAmt.toFixed(2));
    }
    setSevaType(value);
  };

  return (
    <section>
      {ordStatus === "Unpaid" ? (
        <div>
          {data && loading == false ? (
            <div>
              <div className="flex flex-col items-center">
                <div className="block mb-3 text-lg font-bold p-2.5">
                  Welcome{" "}
                  <span className="text-blue-700">{data.firstname}</span>
                </div>
                <form className="w-auto">
                  {sDocRef === "" ? (
                    <div className="grid md:grid-cols-2 gap-5 mb-1">
                      <div className="flex items-center ps-4 border bg-green-300 border-gray-400 rounded-sm dark:border-gray-700">
                        <input
                          defaultChecked
                          id="radio-1"
                          type="radio"
                          value="Thambila"
                          name="bordered-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleOptionChange(e.target.value)}
                        />
                        <label
                          htmlFor="radio-1"
                          className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Thambila Seva
                        </label>
                      </div>
                      <div className="flex items-center ps-4 border bg-green-300 border-gray-300 rounded-sm dark:border-gray-700">
                        <input
                          id="radio-2"
                          type="radio"
                          value="Donation"
                          name="bordered-radio"
                          className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleOptionChange(e.target.value)}
                        />
                        <label
                          htmlFor="radio-2"
                          className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Donations
                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="grid grid-cols-1 gap-3 mb-2">
                    <div>
                      <label
                        htmlFor="devotee"
                        className="block mb-1 text-sm font-medium text-gray-900 dark:text-white p-0"
                      >
                        Received From
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        id="devotee"
                        value={devoteeName}
                        onChange={(e) => setDevoteeName(e.target.value)}
                        disabled={sDocRef === "" ? false : true}
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
                        value={
                          sevaType === "Thambila"
                            ? "Thambila Seva - Rs.200"
                            : "Bhoo Daana - Rs.1000 per Sq.ft."
                        }
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
                        {sevaType === "Thambila"
                          ? "Total Months"
                          : "Total Sq.ft."}
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="number"
                        id="seva_months"
                        value={totalmonths}
                        onChange={(e) => calcTotalAmount(e.target.value)}
                        disabled={sDocRef === "" ? false : true}
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
                        value={totalAmount}
                        disabled
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex flex-col items-center">
                <div className="grid md:grid-cols-2 gap-5 items-center">
                  {sDocRef === "" ? (
                    <div className="block">
                      <button
                        onClick={addSevaDet}
                        className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div>
                      <PayButton id={sDocRef} sData={data} />
                    </div>
                  )}
                  <div className="block">
                    <button
                      className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleClick}
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <h2 className="font-bold text-wrap break-words">
                  SEVA BILLS PENDING FOR PAYMENT
                </h2>
              </div>
              <div className="relative shadow-md sm:rounded-lg mt-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr key="0">
                      <th scope="col" className="px-6 py-3"></th>
                      <th scope="col" className="px-6 py-3">
                        BillDate
                      </th>
                      <th scope="col" className="px-6 py-3">
                        BillNo.
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sevaData ? (
                      sevaData.map((row) => (
                        <tr
                          key={row.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => getSevaDetails(row.id)}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Show
                            </button>
                          </td>
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {row.bill_date}
                          </th>
                          <td className="px-6 py-4">{row.receipt_no}</td>
                          <td className="px-6 py-4">{row.total_amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div>Loading... Please Wait...</div>
            </div>
          )}{" "}
        </div>
      ) : (
        <div>FOR PRINTING....</div>
      )}
    </section>
  );
}
