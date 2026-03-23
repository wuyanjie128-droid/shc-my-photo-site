"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";

export default function CityCategoryPage() {
  const params = useParams();
  const [videos, setVideos] = useState<any[]>([]);

  const cityName = decodeURIComponent(String(params.city || ""));

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("videos") || "[]");
    setVideos(data);
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => v.city === cityName);
  }, [videos, cityName]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-black">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{cityName} 分类</h1>
            <p className="mt-1 text-sm text-gray-500">
              查看 {cityName} 的视频内容
            </p>
          </div>

          <a
            href="/category"
            className="rounded-xl border px-4 py-2"
          >
            返回分类页
          </a>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              当前城市：<span className="font-medium text-black">{cityName}</span>
            </p>
            <span className="text-sm text-gray-500">
              共 {filteredVideos.length} 条
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredVideos.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-gray-500">
              这个城市暂时还没有内容。
            </div>
          ) : (
            filteredVideos.map((v, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex h-48 items-center justify-center rounded-xl bg-black text-white">
                  低清预览
                </div>

                <h2 className="mt-3 text-lg font-semibold">{v.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{v.desc}</p>

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