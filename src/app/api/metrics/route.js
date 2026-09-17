import { NextResponse } from "next/server";
import { getSystemMetrics } from "@/lib/metrics";

export async function GET() {
  try {
    const metrics = await getSystemMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch system metrics" },
      { status: 500 }
    );
  }
}