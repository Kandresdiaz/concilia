import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? "Present (Starts with " + process.env.SHOPIFY_API_KEY.substring(0, 4) + ")" : "MISSING",
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET ? "Present" : "MISSING",
    HOST: process.env.HOST || "MISSING",
    VERCEL_URL: process.env.VERCEL_URL || "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
