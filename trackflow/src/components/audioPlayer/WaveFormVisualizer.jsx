import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export function WaveformVisualizer({ audioUrl }) {
  const waveformRef = useRef(null);
  const audioRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) return;

    if (waveformRef.current && audioRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'oklch(87.2% 0.01 258.338)',
        progressColor: 'oklch(50% 0 0)',
        backgroundColor: 'oklch(26.9% 0 0)',
        barWidth: 2,
        responsive: true,
        height: 80,
        cursorColor: 'white',
        backend: 'MediaElement', // <= très important ici
        mediaControls: false,
        media: audioRef.current, // <= Utilise l'élément audio existant
      });

      wavesurferRef.current = wavesurfer;
    }

    return () => {
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch (error) {
          console.warn('Erreur destruction wavesurfer:', error);
        }
      }
    };
  }, [audioUrl]);

  return (
    <>
      <div id="waveform" ref={waveformRef}></div>
      <audio ref={audioRef} src={audioUrl} preload="auto" hidden />
    </>
  );
}
