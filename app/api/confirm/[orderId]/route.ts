import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;
  const supabase = await createClient();

  const id = Number(orderId);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "订单ID无效" }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.redirect(`http://localhost:3000/video/${order.video_id}`, {
      status: 303,
    });
  }

  await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", order.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", order.creator_id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: order.creator_id,
      balance: 0,
    });
  }

  const { data: profile2 } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", order.creator_id)
    .single();

  const currentBalance = Number(profile2?.balance || 0);

  await supabase
    .from("profiles")
    .update({
      balance: currentBalance + Number(order.creator_amount),
    })
    .eq("id", order.creator_id);

  const { data: existingPurchase } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", order.buyer_id)
    .eq("video_id", order.video_id)
    .single();

  if (!existingPurchase) {
    await supabase.from("purchases").insert({
      user_id: order.buyer_id,
      video_id: order.video_id,
    });
  }

  return NextResponse.redirect(`http://localhost:3000/video/${order.video_id}`, {
    status: 303,
  });
}