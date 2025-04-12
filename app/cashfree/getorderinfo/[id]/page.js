import { Cashfree } from "cashfree-pg";
import { use } from "react";

Cashfree.XClientId = process.env.Cashfree_ClientId;
Cashfree.XClientSecret = process.env.Cashfree_ClientSecret;
if (process.env.NEXT_PUBLIC_Cashfree_Env == "sandbox") {
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
} else {
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
}

export default async function getorderinfo({ params }) {
  const { id } = use(params);
  let version = "2023-08-01";
  //const response = await Cashfree.PGFetchOrder(version, id);

  Cashfree.PGFetchOrder(version, id)
    .then((response) => {
      console.log("Order fetched successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.response.data.message);
    });

  return (
    <main>
      <div>Order Completed... </div>
    </main>
  );
}
