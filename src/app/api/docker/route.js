import { NextResponse } from "next/server";
import { getContainers } from "@/lib/docker";

export async function GET() {
  try {
    const containers = await getContainers();
    return NextResponse.json(containers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to Docker. Is Docker Desktop running?" },
      { status: 500 }
    );
  }
}