import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("http://localhost:3000/login", {
      status: 303,
    });
  }

  const id = Number(videoId);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "视频ID无效" }, { status: 400 });
  }

  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (videoError || !video) {
    return NextResponse.json({ error: "视频不存在" }, { status: 404 });
  }

  const total = Number(video.price);
  const platformFee = total * 0.2;
  const creatorAmount = total * 0.8;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: user.id,
      creator_id: video.user_id,
      video_id: video.id,
      total_amount: total,
      platform_fee: platformFee,
      creator_amount: creatorAmount,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "创建订单失败", detail: orderError?.message },
      { status: 500 }
    );
  }

  return NextResponse.redirect(`http://localhost:3000/pay/${order.id}`, {
    status: 303,
  });
}