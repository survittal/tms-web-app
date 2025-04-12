"use client";
import { useState } from "react";

const cashfree = () => {
  const [orderid, setorderid] = useState("");
  const [orderStatus, setorderStatus] = useState("");

  const verifyPayment = async () => {
    console.log(orderid);

    const response = await fetch("/cashfree/verifystatus", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: '{"order_id":"' + orderid + '", "cust_name":"surendra"}',
    });

    if (response) {
      const data = await response.json();
      console.log(data);
      setorderStatus(data.data.order_status);
      //setorderid(data.data.order_id);
    }
  };

  return (
    <div className="flex flex-col items-center mb-2">
      {orderStatus === "PAID" ? (
        <h1>Congratulations... Payment Success</h1>
      ) : (
        <h1>Payment Failed or Invalid Order ID</h1>
      )}
      <input
        className="border-black border bg-slate-300 mb-5 mt-5 p-2 text-sm rounded-md"
        id="orderid"
        onChange={(e) => setorderid(e.target.value)}
      ></input>
      <button
        className="block bg-slate-800 text-white p-2 text-md"
        onClick={verifyPayment}
      >
        Verify Payment
      </button>
    </div>
  );
};

export default cashfree;
