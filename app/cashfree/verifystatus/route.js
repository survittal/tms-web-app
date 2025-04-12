import { Cashfree } from "cashfree-pg";

Cashfree.XClientId = process.env.Cashfree_ClientId;
Cashfree.XClientSecret = process.env.Cashfree_ClientSecret;
if (process.env.NEXT_PUBLIC_Cashfree_Env == "sandbox") {
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
} else {
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
}

export async function POST(req, res) {
  let version = "2023-08-01";

  const reqdata = await req.json();
  console.log(reqdata.order_id);
  try {
    const result = await Cashfree.PGFetchOrder(version, reqdata.order_id).catch(
      (error) => {
        console.error("Error:", error.message);
        return Response.json(
          {
            success: false,
            message: "No response data received from Cashfree.",
          },
          { status: 500 }
        );
      }
    );

    /*
  Cashfree.PGFetchOrder(version, reqdata.order_id)
    .then((response) => {
      console.log("Order fetched successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.response.data.message);
    });
*/

    if (result.status == 200) {
      console.log("Order fetched successfully:", result.data);
      // res.json(response.data);
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
        message: "Error processing the request.",
      },
      { status: 500 }
    );
  }
}
