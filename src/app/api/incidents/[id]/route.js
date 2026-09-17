import { NextResponse } from "next/server";
import { getIncidentById, resolveIncident } from "@/lib/incidentStore";

export async function GET(request, { params }) {
  const { id } = await params;
  const incident = await getIncidentById(id);

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  return NextResponse.json(incident);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const incident = await resolveIncident(id);

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  return NextResponse.json(incident);
}