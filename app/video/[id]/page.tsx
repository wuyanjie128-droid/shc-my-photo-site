import { createClient } from "@/lib/supabase/server";
import Player from "@/app/components/Player";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!video) {
    return <div className="p-6">视频不存在</div>;
  }

  let hasPurchased = false;

  if (user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("video_id", video.id)
      .single();

    hasPurchased = !!purchase;
  }

  return (
    <main className="p-6">
      <a href="/" className="inline-block rounded border px-4 py-2">
        返回首页
      </a>

      {video.status !== "ready" || !video.mux_playback_id ? (
        <p className="mt-4">视频处理中...</p>
      ) : (
        <>
          <Player playbackId={video.mux_playback_id} />

          {!hasPurchased && (
            <div className="mt-4 rounded border p-4">
              <p className="text-sm text-orange-500">
                当前为预览模式，购买后解锁完整内容
              </p>
              <p className="mt-2 text-xl font-bold">￥{video.price}</p>

              <form action={`/api/order/${video.id}`} method="POST">
                <button className="mt-3 rounded bg-black px-4 py-2 text-white">
                  下单购买
                </button>
              </form>
            </div>
          )}

          {hasPurchased && (
            <div className="mt-4">
              <p className="text-green-600">已购买 ✅ 可继续观看</p>

              <a
                href={`https://stream.mux.com/${video.mux_playback_id}.m3u8`}
                download
                className="mt-2 inline-block rounded bg-black px-4 py-2 text-white"
              >
                下载视频
              </a>
            </div>
          )}
        </>
      )}

      <h1 className="mt-4 text-xl font-bold">{video.title}</h1>
      <p>{video.description}</p>
    </main>
  );
}