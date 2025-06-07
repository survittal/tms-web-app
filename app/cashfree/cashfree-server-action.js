"use server";

import { Cashfree } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";
import { shortDateTime, updateDocument } from "../db/devotee";

const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;

Cashfree.XClientId = process.env.Cashfree_ClientId;
Cashfree.XClientSecret = process.env.Cashfree_ClientSecret;
if (process.env.NEXT_PUBLIC_Cashfree_Env == "sandbox") {
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
} else {
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
}

function generateOrderID() {
  const uniqueID = uuidv4();
  return uniqueID.substring(0, 12);
}

export async function onPay({ id, newData }) {
  let order_id = generateOrderID();

  try {
    let request = {
      order_amount: `${newData.totAmount}`,
      order_currency: "INR",
      order_id: order_id,
      customer_details: {
        customer_id: `${newData.empid}`,
        customer_phone: `${newData.mobileno}`,
        customer_name: `${newData.firstname}`,
        customer_email: `${newData.email}`,
      },
      order_meta: {
        return_url: `${process.env.Cashfree_Return_URL}`,
        notify_url:
          "https://easyapi.sunsofttech.in/tms-web-app/cashfree-pg/mywebhook.php",
      },
    };

    const result = await Cashfree.PGCreateOrder("2023-08-01", request);

    const uResult = await updateDocument(
      "devotees/" + newData.id + "/sevadet",
      newData.sevaRefId,
      {
        order_id: result.data.order_id,
        order_date: shortDateTime(result.data.created_at),
        cust_mob: result.data.customer_details.customer_phone,
        trn_ref: result.data.cf_order_id,
      }
    );

    return {
      OrderID: order_id,
      documentId: id,
      payment_session_id: result.data.payment_session_id,
    };
  } catch (error) {
    return { error: error };
  }
}

export async function verifyPayment({ order_id }) {
  let version = "2023-08-01";

  try {
    const result = await Cashfree.PGFetchOrder(version, order_id).catch(
      (error) => {
        console.error("Error:", error.message);
        return { success: false };
      }
    );

    if (result.status == 200) {
      //console.log("Order fetched successfully:", result.data);
      return {
        success: true,
        message: "Order created successfully!",
        data: result.data,
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error in order creation:", error);
    return { success: false };
  }
  //const data = await getDataForId(id);
}
