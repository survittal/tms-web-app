import { Cashfree } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";

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
  /*
  const uniqueID = randomBytes(16).toString("hex");
  const hash = createHash("sha256");
  hash.update(uniqueID);
  const orderID = hash.digest("hex");*/

  const uniqueID = uuidv4();
  return uniqueID.substring(0, 12);
}

export async function POST(req, res) {
  try {
    /*
    const headersList = await headers();
    console.log(headers);
    const hClientID = headersList.get("ClientID");
    console.log(hClientID);
*/
    const data = await req.json();

    let order_id = generateOrderID();

    console.log(order_id);

    let request = {
      order_amount: data.orderamount,
      order_currency: data.order_currency,
      order_id: order_id,
      customer_details: {
        customer_id: data.customer_details.customer_id,
        customer_phone: data.customer_details.customer_phone,
        customer_name: data.customer_details.customer_name,
        customer_email: data.customer_details.customer_email,
      },
      order_meta: {
        return_url: "https://test.cashfree.com/pgappsdemos/return.php?order_id=order_123",
      },
    };

    const result = await Cashfree.PGCreateOrder("2023-08-01", request);

    console.log(result.data);

    if (result.status == 200) {
      return Response.json({
        success: true,
        message: "Order created successfully!",
        data: result.data,
      });
    } else {
      return Response.json(
        {
          success: false,
          message: "No response data received from Cashfree.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in order creation:", error);
    return Response.json(
      {
        success: false,
        message:
          error?.response?.data?.message || "Error processing the request.",
      },
      { status: 500 }
    );
  }
}
