"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export function WaveformVisualizer({ audioUrl }) {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4F4A85",
        progressColor: "#383351",
        url: audioUrl,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
      });

      wavesurfer.on("interaction", () => {
        wavesurfer.play();
      });


       return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioUrl]);

  return <div ref={waveformRef} id="waveform"></div>;
}
