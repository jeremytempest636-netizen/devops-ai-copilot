import { NextResponse } from "next/server";
import { analyzeLogs } from "@/lib/ai";
import { createIncident } from "@/lib/incidentStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { logs } = body;

    if (!logs || logs.trim().length === 0) {
      return NextResponse.json(
        { error: "No logs provided" },
        { status: 400 }
      );
    }

    const diagnosis = await analyzeLogs(logs);
    const incident = await createIncident(diagnosis, "manual-log");

    return NextResponse.json(incident);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "AI analysis failed. Please check your API configuration." },
      { status: 500 }
    );
  }
}