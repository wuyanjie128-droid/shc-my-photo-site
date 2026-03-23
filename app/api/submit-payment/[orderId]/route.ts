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

  const { error } = await supabase
    .from("orders")
    .update({ status: "submitted" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }

  return NextResponse.redirect(new URL(`/order-submitted/${id}`, req.url), {
    status: 303,
  });
}