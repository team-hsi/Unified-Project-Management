import { NextResponse } from "next/server";

import { tasks } from "@/lib/stores/initial-data";

type Params = Promise<{ id: string }>;

export async function GET(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task data:", error);
    return NextResponse.json(
      { error: "Failed to fetch task data" },
      { status: 500 }
    );
  }
}
