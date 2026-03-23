import { NextResponse } from "next/server";
import { mux } from "@/lib/mux";

export async function POST() {
  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policies: ["public"],
        video_quality: "basic",
      },
      cors_origin: "*",
    });

    return NextResponse.json({
      id: upload.id,
      url: upload.url,
    });
  } catch (error) {
    console.error("Mux upload create error:", error);
    return NextResponse.json(
      { error: "创建 Mux 上传地址失败" },
      { status: 500 }
    );
  }
}