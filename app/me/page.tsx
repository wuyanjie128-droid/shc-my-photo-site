"use client";

import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

export default function MePage() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("videos") || "[]");
    setVideos(data);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-black">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">我的</h1>
          <p className="mt-1 text-sm text-gray-500">
            查看你的上传记录和账户信息
          </p>
        </header>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">我的上传</p>
            <p className="mt-3 text-3xl font-bold">{videos.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">我的购买</p>
            <p className="mt-3 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">累计收益</p>
            <p className="mt-3 text-3xl font-bold">￥0</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">待结算</p>
            <p className="mt-3 text-3xl font-bold">￥0</p>
          </div>
        </div>

        {/* 上传列表 */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">我的上传</h2>

          <div className="mt-4 space-y-4">
            {videos.length === 0 ? (
              <p className="text-gray-500">你还没有上传任何视频</p>
            ) : (
              videos.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold">{v.title}</p>
                    <p className="text-sm text-gray-500">
                      {v.city} · ￥{v.price}
                    </p>
                  </div>

                  <a
                    href={`/video/${v.id}`}
                    className="rounded-lg bg-black px-3 py-1 text-white text-sm"
                  >
                    查看
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}