"use client";

import { useState } from "react";
import { UpChunk } from "@mux/upchunk";
import { createClient } from "@/lib/supabase/client";

const cities = ["上海", "北京", "广州", "深圳", "香港", "澳门", "台北", "其他"];

export default function UploadPage() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("上海");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const pollMuxStatus = async (uploadId: string, videoId: number) => {
    let tries = 0;

    const timer = setInterval(async () => {
      tries += 1;

      try {
        const res = await fetch(`/api/mux-status/${uploadId}`);
        const data = await res.json();

        console.log("Mux 状态:", data);

        const assetId = data?.asset_id || data?.asset?.id;

        if (assetId) {
          // 再去拿 asset 详情
          const assetRes = await fetch(`/api/mux-asset/${assetId}`);
          const assetData = await assetRes.json();

          console.log("Mux Asset:", assetData);

          const playbackId = assetData?.playback_ids?.[0]?.id;

          if (playbackId) {
            // 更新数据库
            const { error } = await supabase
              .from("videos")
              .update({
                mux_asset_id: assetId,
                mux_playback_id: playbackId,
                status: "ready",
              })
              .eq("id", videoId);

            if (error) {
              console.error("更新数据库失败:", error);
            }

            clearInterval(timer);
            alert("视频处理完成，可以播放了");
            window.location.href = `/video/${videoId}`;
          }
        }

        if (tries > 60) {
          clearInterval(timer);
          alert("视频还在处理中，请稍后去首页或我的页面查看");
        }
      } catch (err) {
        console.error("轮询失败:", err);
      }
    }, 5000);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("请选择视频");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      setStatusText("正在获取上传地址...");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("请先登录");
        window.location.href = "/login";
        return;
      }

      // 1. 创建 Mux 上传地址
      const res = await fetch("/api/mux-upload", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.url || !data.id) {
        throw new Error(data.error || "获取上传地址失败");
      }

      const uploadId = data.id;

      // 2. 先插入数据库，状态 processing
      const { data: insertedVideo, error: insertError } = await supabase
        .from("videos")
        .insert({
          user_id: user.id,
          title,
          description: desc,
          city,
          price: Number(price),
          preview_url: "",
          full_url: "",
          mux_upload_id: uploadId,
          status: "processing",
        })
        .select()
        .single();

      if (insertError || !insertedVideo) {
        console.error(insertError);
        alert("写入数据库失败");
        return;
      }

      setStatusText("开始上传视频...");

      // 3. 上传到 Mux
      const upload = UpChunk.createUpload({
        endpoint: data.url,
        file,
        chunkSize: 20480,
      });

      upload.on("progress", (event) => {
        const percent = Math.round(event.detail);
        setProgress(percent);
        setStatusText(`上传中... ${percent}%`);
      });

      upload.on("error", (err) => {
        console.error("上传失败:", err);
        alert("上传失败");
        setLoading(false);
        setStatusText("");
      });

      upload.on("success", async () => {
        setProgress(100);
        setStatusText("上传完成，Mux 正在转码处理中...");
        // 4. 开始轮询
        await pollMuxStatus(uploadId, insertedVideo.id);
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      alert("上传失败");
      setLoading(false);
      setStatusText("");
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex gap-3">
          <a href="/" className="inline-block rounded-xl border px-4 py-2">
            返回首页
          </a>
        </div>

        <h1 className="text-3xl font-bold">上传视频（Mux版）</h1>

        <div className="mt-8 space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="视频标题"
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="视频描述"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="价格"
            className="w-full rounded-xl border px-4 py-3"
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          >
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-xl border px-4 py-3"
          />

          {loading && (
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-700">{statusText}</p>
              <div className="mt-3 h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-black transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-60"
          >
            {loading ? "上传中..." : "上传视频"}
          </button>
        </div>
      </div>
    </main>
  );
}