// /pages/api/your-endpoint.js

import { getAllDevoteeSeva } from "@/app/db/devotee";

export async function GET(req) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey == "tms-web-devotees@602") {
    const data = await getAllDevoteeSeva();
    if (data == 0) {
      return Response.json("Error Found...");
    } else {
      return Response.json(data);
    }
  } else {
    return Response.json("Invalid API Key...");
  }
}
