import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    return NextResponse.json("Surendra Suvarna");
  } catch (err) {
    return NextResponse.json("Surendra Suvarna error");
  }
}
