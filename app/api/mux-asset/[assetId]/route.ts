import { NextResponse } from "next/server";
import { mux } from "@/lib/mux";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;
    const asset = await mux.video.assets.retrieve(assetId);
    return NextResponse.json(asset);
  } catch (error) {
    console.error("Mux asset error:", error);
    return NextResponse.json(
      { error: "获取 asset 失败" },
      { status: 500 }
    );
  }
}