"use server";

import { Cashfree, CFEnvironment } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";
import {
  shortDateTime,
  updateDocument,
  getAllDevoteeSeva,
} from "../db/devotee";

const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.Cashfree_ClientId,
  process.env.Cashfree_ClientSecret
);

/*
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
*/

export async function onPay({ id, newData }) {
  try {
    let request = {
      order_amount: `${newData.totAmount}`,
      order_currency: "INR",
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
      order_note: "",
    };

    const result = await cashfree.PGCreateOrder(request);
    //console.log(result);

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
      OrderID: result.data.order_id,
      documentId: id,
      payment_session_id: result.data.payment_session_id,
    };
  } catch (error) {
    return { error: error };
  }
}

export async function verifyPayment({ order_id }) {
  //let version = "2023-08-01";
  try {
    const result = await cashfree.PGFetchOrder(order_id).catch((error) => {
      return { success: false };
    });

    if (result.status == 200) {
      return {
        success: true,
        message: "Order created successfully!",
        data: result.data,
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
}

export async function getPaymentStatus({ order_id }) {
  const url = `https://api.cashfree.com/pg/orders/${order_id}`;
  const options = {
    method: "GET",
    headers: {
      "x-api-version": "2025-01-01",
      "x-client-id": process.env.Cashfree_ClientId,
      "x-client-secret": process.env.Cashfree_ClientSecret,
    },
    body: undefined,
  };

  try {
    const response = await fetch(url, options);
    const rdata = await response.json();
    return {
      success: true,
      message: "Order created successfully!",
      data: rdata,
    };
  } catch (error) {
    return { success: false };
  }
}

export async function ValidatePayments() {
  try {
    getAllDevoteeSeva().then(function (result) {
      result.sevadata.map(async (item) => {
        let oStatus = "";
        item.sevaDet.map(
          async (sItem) =>
            await getPaymentStatus({ order_id: sItem.order_id }).then(function (
              resultNew
            ) {
              //console.log(resultNew);
              if (resultNew.success === true) {
                if (resultNew.data.order_status != "PAID") {
                  oStatus = "Unpaid";
                } else {
                  oStatus = "PAID";
                }
                const uResult = updateDocument(
                  "devotees/" + item.devoteeID + "/sevadet",
                  sItem.id,
                  {
                    order_status: oStatus,
                  }
                );
              }
            })
        );
      });
    });
    return { success: true };
  } catch (error) {
    console.log("error while reading", error);
    return { success: false };
  }
}
