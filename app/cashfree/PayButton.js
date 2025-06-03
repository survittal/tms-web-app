"use client";

import { useRouter } from "next/navigation";

//import useRouter from "../components/useRouter";

import { onPay, verifyPayment } from "./cashfree-server-action";
import { load } from "@cashfreepayments/cashfree-js";
import { updateDocument } from "../db/devotee";
import { useState } from "react";

const initializeSDK = async () => {
  const cashfree = await load({ mode: process.env.NEXT_PUBLIC_Cashfree_Env }); //
  return cashfree;
};

export default function PayButton({ id, sData }) {
  const router = useRouter();
  const [ordStatus, setOrdStatus] = useState("Unpaid");
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={async () => {
        setLoading(true);
        const ret = await onPay({ id: id, newData: sData });
        try {
          const cashfree = await initializeSDK();

          let checkoutOptions = {
            paymentSessionId: ret.payment_session_id,
            redirectTarget: "_modal",
          };

          cashfree.checkout(checkoutOptions).then((result) => {
            console.log("payment status:", result);

            if (result.error) {
              alert(result.error.message);
            }
            /*
              if (result.redirect) {
                //alert("Redirection");
                //alert("Order ID : ", reqData.order_id);
              }
      */

            async function handler() {
              const result = await verifyPayment({ order_id: ret.OrderID });
              //console.log("PayStatus - ", result);
              setOrdStatus(result.data.order_status);
              const uResult = await updateDocument(
                "devotees/" + sData.id + "/sevadet",
                sData.sevaRefId,
                {
                  order_status: result.data.order_status,
                }
              );
              console.log(uResult);
              router.push(
                `/seva/printing?id1=${sData.id}&id2=${sData.sevaRefId}`
              );
            }

            if (result.paymentDetails) {
              handler();
            }
          });
        } catch (error) {
          console.log(error);
        }
      }}
      disabled={ordStatus === "PAID" || loading === true ? true : false}
    >
      {ordStatus === "PAID" ? "Paid" : "Pay Now"}
    </button>
  );
}
