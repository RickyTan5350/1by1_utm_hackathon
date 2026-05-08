import React, { useRef, useEffect } from 'react';

interface ChromakeyVideoProps {
  src: string;
  className?: string;
  threshold?: number;
}

export const ChromakeyVideo: React.FC<ChromakeyVideoProps> = ({ src, className, threshold = 180 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      if (!video || video.paused || video.ended) {
          animationFrameId = requestAnimationFrame(renderFrame);
          return;
      }

      if (video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const avg = (r + g + b) / 3;
          const isGreyish = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;
          
          if (isGreyish && avg > threshold) {
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    video.play().catch(err => console.error("Video play failed:", err));
    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [src, threshold]);

  return (
    <div className={className} style={{ position: 'relative', minWidth: '10px', minHeight: '10px' }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        style={{ 
          position: 'absolute', 
          width: '1px', 
          height: '1px', 
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};
