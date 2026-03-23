"use client";

import MuxPlayer from "@mux/mux-player-react";

export default function Player({
  playbackId,
}: {
  playbackId: string;
}) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay={false}
      preload="metadata"
      style={{ width: "100%" }}
      maxResolution="720p"
    />
  );
}