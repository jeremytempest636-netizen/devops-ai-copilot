import { NextResponse } from "next/server";
import {
  getIncidents,
  createIncident,
  clearAllIncidents,
} from "@/lib/incidentStore";
import { analyzeIncidentFromSystemState } from "@/lib/ai";
import { getContainers } from "@/lib/docker";
import { getSystemMetrics } from "@/lib/metrics";

export async function GET() {
  try {
    const incidents = await getIncidents();

    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Failed to load incidents:", error);

    return NextResponse.json(
      { error: "Failed to load incidents" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const [containers, metrics] = await Promise.all([
      getContainers(),
      getSystemMetrics(),
    ]);

    const diagnosis = await analyzeIncidentFromSystemState({
      containers,
      metrics,
    });

    const incident = await createIncident(
      diagnosis,
      "auto-detection"
    );

    return NextResponse.json(incident);
  } catch (error) {
    console.error("Incident detection error:", error);

    return NextResponse.json(
      {
        error: "Failed to run incident detection",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearAllIncidents();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to clear incidents:", error);

    return NextResponse.json(
      { error: "Failed to clear incidents" },
      { status: 500 }
    );
  }
}