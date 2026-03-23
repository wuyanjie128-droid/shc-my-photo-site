export default async function OrderSubmittedPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">已提交付款信息</h1>
      <p className="mt-3 text-gray-600">
        订单 {orderId} 已进入待确认状态。平台确认收款后会自动解锁视频。
      </p>

      <a
        href="/me/orders"
        className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
      >
        查看我的订单
      </a>
    </main>
  );
}