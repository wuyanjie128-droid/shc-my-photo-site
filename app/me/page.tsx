"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";

type VideoItem = {
  id?: number | string;
  title?: string;
  city?: string;
  price?: number | string;
};

export default function MePage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [nickname, setNickname] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const localVideos = JSON.parse(localStorage.getItem("videos") || "[]");
    setVideos(localVideos);

    const storedNickname = localStorage.getItem("profile_nickname") || "";
    const storedCreatorId = localStorage.getItem("profile_creator_id") || "";
    const storedBio = localStorage.getItem("profile_bio") || "";

    setNickname(storedNickname || "SHC 创作者");
    setCreatorId(storedCreatorId || "shc_creator");
    setBio(
      storedBio ||
        "介绍一下你自己、你的拍摄风格、擅长的城市和你想长期分享的内容。"
    );
  }, []);

  const totalRevenue = useMemo(() => {
    return videos.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [videos]);

  const handleSaveProfile = () => {
    localStorage.setItem("profile_nickname", nickname);
    localStorage.setItem("profile_creator_id", creatorId);
    localStorage.setItem("profile_bio", bio);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-black">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">我的页面 NEW</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理你的昵称、创作者ID、简介、上传记录和主页信息
            </p>
          </div>

          <a
            href="/"
            className="inline-block rounded-xl border bg-white px-4 py-2 text-sm"
          >
            返回主页
          </a>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-gray-500">公开主页预览</p>
              <h2 className="mt-2 text-2xl font-bold">{nickname || "SHC 创作者"}</h2>
              <p className="mt-2 text-sm text-gray-500">@{creatorId || "shc_creator"}</p>
              <p className="mt-3 max-w-2xl text-sm text-gray-700">{bio}</p>
            </div>

            <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
              可用于公开搜索的创作者标识：
              <span className="ml-1 font-semibold text-black">
                @{creatorId || "shc_creator"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                昵称
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="输入你的昵称"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                创作者 ID
              </label>
              <input
                value={creatorId}
                onChange={(e) =>
                  setCreatorId(e.target.value.replace(/\s+/g, "_").toLowerCase())
                }
                placeholder="例如：shc_creator"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
              <p className="mt-2 text-xs text-gray-500">
                建议使用字母、数字和下划线，方便被别人搜索。
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              自定义简介
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="写一段关于你的简介，让别人更愿意长期订阅和购买你的内容。"
              className="min-h-[120px] w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveProfile}
              className="rounded-xl bg-black px-5 py-3 text-white"
            >
              保存我的信息
            </button>

            <a
              href={creatorId ? `/u/${creatorId}` : "/me"}
              className="rounded-xl border px-5 py-3"
            >
              查看公开主页
            </a>

            {saved && <span className="text-sm text-green-600">已保存</span>}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">我的上传</p>
            <p className="mt-3 text-3xl font-bold">{videos.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">我的购买</p>
            <p className="mt-3 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">累计标价</p>
            <p className="mt-3 text-3xl font-bold">￥{totalRevenue}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">待结算</p>
            <p className="mt-3 text-3xl font-bold">￥0</p>
          </div>
        </div>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">我的上传</h2>
              <p className="mt-1 text-sm text-gray-500">
                这里会展示你发布的内容，别人以后可以通过你的主页长期关注和购买。
              </p>
            </div>

            <a href="/upload" className="rounded-xl bg-black px-4 py-2 text-white">
              去上传
            </a>
          </div>

          <div className="mt-4 space-y-4">
            {videos.length === 0 ? (
              <p className="text-gray-500">你还没有上传任何视频</p>
            ) : (
              videos.map((v, i) => (
                <div
                  key={String(v.id ?? i)}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold">{v.title || "未命名视频"}</p>
                    <p className="text-sm text-gray-500">
                      {v.city || "未分类"} · ￥{v.price || 0}
                    </p>
                  </div>

                  <a
                    href={`/video/${v.id}`}
                    className="rounded-lg bg-black px-3 py-1 text-sm text-white"
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