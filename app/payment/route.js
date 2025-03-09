require("dotenv").config();
import { Cashfree } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";

const EventEmitter = require("events");

EventEmitter.defaultMaxListeners = 15;

Cashfree.XClientId = process.env.Cashfree_ClientId;
Cashfree.XClientSecret = process.env.Cashfree_ClientSecret;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderID() {
  /*
  const uniqueID = randomBytes(16).toString("hex");
  const hash = createHash("sha256");
  hash.update(uniqueID);
  const orderID = hash.digest("hex");*/

  const uniqueID = uuidv4();
  return uniqueID.substring(0, 12);
}

export async function POST(req) {
  try {
    /*
    const headersList = await headers();
    const hClientID = headersList.get("ClientID");
    console.log(hClientID);
*/
    const data = await req.json();
    //console.log("Order Amount :", data.orderamount);

    let request = {
      order_amount: data.orderamount,
      order_currency: data.order_currency,
      order_id: generateOrderID(),
      customer_details: {
        customer_id: data.customer_details.customer_id,
        customer_phone: data.customer_details.customer_phone,
        customer_name: data.customer_details.customer_name,
        customer_email: data.customer_details.customer_email,
      },
      order_meta: {
        return_url:
          "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
      },
    };

    const result = await Cashfree.PGCreateOrder("2023-08-01", request);
    //console.log("Result : ", result.data);
    return Response.json(result.data);
  } catch (err) {
    return Response.json("Error");
  }
}
