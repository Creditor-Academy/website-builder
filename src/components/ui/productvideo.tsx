import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const videoSrc = "https://buildora-assets.s3.us-east-1.amazonaws.com/promo-video/Web+Studio.mp4";

export default function ProductVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section className="flex w-full max-w-full min-w-0 flex-col items-center py-8 sm:py-12">
      <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-xl bg-slate-900 shadow-2xl sm:rounded-2xl">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="block h-full w-full max-w-full object-cover"
        />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 sm:bottom-4 sm:right-4 sm:h-11 sm:w-11"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </section>
  );
}
