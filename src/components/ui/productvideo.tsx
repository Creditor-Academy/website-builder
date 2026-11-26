import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const videoSrc = "/video/studio-tour.mp4";
const posterSrc = "/video/studio-tour-poster.webp";

export default function ProductVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoadVideo(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const play = () => {
      void video.play().catch(() => undefined);
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, [loadVideo]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section ref={sectionRef} className="flex w-full max-w-full min-w-0 flex-col items-center py-8 sm:py-12">
      <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-xl bg-slate-900 shadow-2xl sm:rounded-2xl">
        <video
          ref={videoRef}
          poster={posterSrc}
          preload="none"
          muted
          loop
          playsInline
          width={1280}
          height={720}
          src={loadVideo ? videoSrc : undefined}
          className="block h-full w-full max-w-full object-cover"
        />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-3 right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 sm:bottom-4 sm:right-4"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </section>
  );
}
