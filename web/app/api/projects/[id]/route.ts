import { NextResponse } from "next/server";

import { boardData } from "@/lib/stores/initial-data";

export async function GET() {
  try {
    // Simulate a slight delay to mimic a real API
    // await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(boardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching board data:", error);
    return NextResponse.json(
      { error: "Failed to fetch board data" },
      { status: 500 }
    );
  }
}
