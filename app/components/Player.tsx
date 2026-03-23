"use client";

import MuxPlayer from "@mux/mux-player-react";

export default function Player({
  playbackId,
  hasPurchased,
}: {
  playbackId: string;
  hasPurchased: boolean;
}) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      controls={hasPurchased}
      autoPlay={false}
      preload="metadata"
      style={{ width: "100%" }}

      // ✅ 关键：480p预览
      maxResolution={hasPurchased ? "1080p" : "480p"}
    />
  );
}