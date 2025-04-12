import { SHA256 } from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function POST(req, res) {
  const transactionId = "MT-" + uuidv4().toString(36).slice(-6);

  const payLoad = {
    merchantId: "PGTESTPAYUAT86",
    merchantTransactionId: "MT" + uuidv4().toString(36).slice(-6),
    merchantUserId: "MUID" + uuidv4().toString(36).slice(-6),
    amount: 20000,
    redirectUrl: "http://localhost:3000",
    redirectMode: "POST",
    callbackUrl: "http://localhost:3000",
    mobileNumber: "9448626056",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  try {
    const dataPayLoad = JSON.stringify(payLoad);
    console.log(dataPayLoad);
    const dataBase64 = Buffer.from(dataPayLoad).toString("base64");
    const saltKey = "96434309-7796-489d-8924-ab56988a6076";
    const checkSum = SHA256(dataBase64 + "/pg/v1/pay" + saltKey) + "###" + 1;

    console.log("Ch", checkSum);

    const payURL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const options = {
      method: "POST",
      url: payURL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checkSum,
      },
      data: {
        request: dataBase64,
      },
    };

    const response = await axios.request(options);

    return Response.json({
      success: true,
      message: "Order created successfully!",
      data: response.data,
    });
  } catch (error) {
    console.log(error);
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
