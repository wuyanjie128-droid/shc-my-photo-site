import { createClient } from "@/lib/supabase/server";

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", Number(orderId))
    .single();

  if (!order) {
    return <div className="p-6">订单不存在</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">支付订单</h1>

      <p className="mt-4">订单号：{order.id}</p>
      <p>金额：￥{order.total_amount}</p>

      <div className="mt-6 rounded border p-4">
        <p className="font-medium">请扫码支付</p>
        <p className="mt-2 text-sm text-gray-600">
          支付完成后点击“我已付款”，订单会进入待确认状态。平台确认收款后自动解锁视频。
        </p>

        <div className="mt-4 flex gap-4">
          <img src="/wechat.png" className="w-40 rounded border" />
          <img src="/alipay.png" className="w-40 rounded border" />
        </div>

        <form
          action={`/api/submit-payment/${order.id}`}
          method="POST"
          className="mt-4"
        >
          <button className="rounded bg-black px-4 py-2 text-white">
            我已付款
          </button>
        </form>
      </div>
    </main>
  );
}