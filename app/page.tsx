import BottomNav from "./components/BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: videos = [], error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-black">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">浏览 / 上传</h1>
            <p className="mt-1 text-sm text-gray-500">
              浏览视频内容，也可以发布你自己的作品
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/category" className="rounded-xl border bg-white px-4 py-2">
              分类
            </a>
            <a href="/me" className="rounded-xl border bg-white px-4 py-2">
              我的
            </a>
            <a href="/upload" className="rounded-xl bg-black px-4 py-2 text-white">
              上传
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {videos.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-gray-500">
              还没有内容，先去上传一个视频吧。
            </div>
          ) : (
            videos.map((v) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex h-48 items-center justify-center rounded-xl bg-black text-white">
                  低清预览
                </div>

                <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {v.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    {v.city}
                  </span>
                  <span className="text-lg font-bold">￥{v.price}</span>
                </div>

                <a
                  href={`/video/${v.id}`}
                  className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-white"
                >
                  查看详情
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}