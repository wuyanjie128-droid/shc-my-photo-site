import { createClient } from "@/lib/supabase/server";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">订单管理</h1>

      <div className="mt-6 space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="rounded border p-4">
            <p>订单号：{order.id}</p>
            <p>视频ID：{order.video_id}</p>
            <p>买家：{order.buyer_id}</p>
            <p>作者：{order.creator_id}</p>
            <p>金额：￥{order.total_amount}</p>
            <p>状态：{order.status}</p>

            {order.status === "submitted" && (
              <form action={`/api/confirm/${order.id}`} method="POST" className="mt-3">
                <button className="rounded bg-black px-4 py-2 text-white">
                  确认已收款并解锁
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}