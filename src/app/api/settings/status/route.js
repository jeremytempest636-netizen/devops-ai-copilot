import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasApiKey: Boolean(process.env.OPENROUTER_API_KEY),
    model: "anthropic/claude-sonnet-5",
  });
}