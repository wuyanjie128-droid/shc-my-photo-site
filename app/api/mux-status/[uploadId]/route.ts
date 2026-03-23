import { NextResponse } from "next/server";
import { mux } from "@/lib/mux";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const { uploadId } = await params;

    const upload = await mux.video.uploads.retrieve(uploadId);

    return NextResponse.json(upload);
  } catch (error) {
    console.error("Mux status error:", error);
    return NextResponse.json(
      { error: "获取上传状态失败" },
      { status: 500 }
    );
  }
}