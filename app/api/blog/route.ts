import { NextResponse } from "next/server";
import { getBlogPostSummaries } from "../../lib/notion-blog";

export async function GET() {
  try {
    return NextResponse.json(await getBlogPostSummaries());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
