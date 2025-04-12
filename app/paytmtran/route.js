import axios from "axios";
const https = require("https");
const PaytmChecksum = require("paytmchecksum");

export async function POST(req) {
  try {
    const data = await req.json();

    console.log(data.ordID, data.email, data.amount);

    var paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: "IRFDpq87854900091248",
      websiteName: "YOUR_WEBSITE_NAME",
      orderId: data.ordID,
      callbackUrl: "http://localhost:3000",
      txnAmount: {
        value: data.amount,
        currency: "INR",
      },
      userInfo: {
        custId: data.email,
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      "_y@#79H3uLo&9yyu"
    );

    console.log(checksum);

    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    const requestAsync = async () => {
      return new Promise((resolve, reject) => {
        var options = {
          /* for Staging */
          hostname: "securegw-stage.paytm.in",

          /* for Production */
          // hostname: 'securegw.paytm.in',

          port: 443,
          path: `/theia/api/v1/initiateTransaction?mid=IRFDpq87854900091248&orderId=${data.ordID}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });
          post_res.on("end", function () {
            console.log("Response: ", response);
            resolve(response);
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
    };

    let myr = await requestAsync();
    return Response.json(myr);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}
