import { NextResponse } from "next/server";
import { getWordImportance } from "@/lib/phi3"; // ✅ Import from lib folder

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const words = await getWordImportance(prompt);
    return NextResponse.json({ words });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch word importance" }, { status: 500 });
  }
}
