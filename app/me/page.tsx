"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const localVideos = JSON.parse(localStorage.getItem("videos") || "[]");
    setVideos(localVideos);

    const storedNickname = localStorage.getItem("profile_nickname") || "SHC 创作者";
    const storedCreatorId = localStorage.getItem("profile_creator_id") || "shc_creator";
    const storedBio =
      localStorage.getItem("profile_bio") ||
      "介绍一下你自己、你的拍摄风格、擅长的城市和你想长期分享的内容。";

    setNickname(storedNickname);
    setCreatorId(storedCreatorId);
    setBio(storedBio);
  }, []);

  const totalRevenue = useMemo(() => {
    return videos.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [videos]);

  const normalizedCreatorId = (creatorId || "shc_creator")
    .replace(/\s+/g, "_")
    .toLowerCase();

  const handleSaveProfile = () => {
    localStorage.setItem("profile_nickname", nickname || "SHC 创作者");
    localStorage.setItem("profile_creator_id", normalizedCreatorId);
    localStorage.setItem(
      "profile_bio",
      bio || "介绍一下你自己、你的拍摄风格、擅长的城市和你想长期分享的内容。"
    );

    setCreatorId(normalizedCreatorId);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 text-black">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">页面加载中...</div>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-black">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">我的页面</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理你的昵称、创作者ID、简介、上传记录，并在同页查看公开展示效果
            </p>
          </div>

          <Link
            href="/"
            className="inline-block rounded-xl border bg-white px-4 py-2 text-sm"
          >
            返回主页
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-gray-500">公开信息预览</p>
              <h2 className="mt-2 text-2xl font-bold">{nickname || "SHC 创作者"}</h2>
              <p className="mt-2 text-sm text-gray-500">@{normalizedCreatorId}</p>
              <p className="mt-3 max-w-2xl text-sm text-gray-700">
                {bio || "介绍一下你自己、你的拍摄风格、擅长的城市和你想长期分享的内容。"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
              可用于公开搜索的创作者标识：
              <span className="ml-1 font-semibold text-black">@{normalizedCreatorId}</span>
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
                onChange={(e) => setCreatorId(e.target.value)}
                placeholder="例如：shc_creator"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
              <p className="mt-2 text-xs text-gray-500">
                保存时会自动转成小写，并把空格替换成下划线。
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

            <span className="rounded-xl border px-5 py-3 text-sm text-gray-600">
              下方已直接展示你的公开主页效果
            </span>

            {saved && <span className="text-sm text-green-600">已保存</span>}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-gray-500">公开主页展示</p>
              <h2 className="mt-2 text-3xl font-bold">{nickname || "SHC 创作者"}</h2>
              <p className="mt-2 text-sm text-gray-500">@{normalizedCreatorId}</p>
              <p className="mt-3 max-w-2xl text-base text-gray-700">
                {bio || "介绍一下你自己、你的拍摄风格、擅长的城市和你想长期分享的内容。"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
              创作者可搜索 ID：
              <span className="ml-1 font-semibold text-black">@{normalizedCreatorId}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-black px-5 py-3 text-white">
              订阅并长期关注
            </button>
            <button className="rounded-xl border px-5 py-3">
              购买创作者内容
            </button>
          </div>

          <div className="mt-6 rounded-2xl border p-5">
            <h3 className="text-lg font-semibold">该创作者发布的内容</h3>
            <div className="mt-4 space-y-4">
              {videos.length === 0 ? (
                <p className="text-gray-500">这个创作者暂时还没有公开内容</p>
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

                    <Link
                      href={`/video/${v.id}`}
                      className="rounded-lg bg-black px-3 py-1 text-sm text-white"
                    >
                      查看
                    </Link>
                  </div>
                ))
              )}
            </div>
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

            <Link href="/upload" className="rounded-xl bg-black px-4 py-2 text-white">
              去上传
            </Link>
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

                  <Link
                    href={`/video/${v.id}`}
                    className="rounded-lg bg-black px-3 py-1 text-sm text-white"
                  >
                    查看
                  </Link>
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