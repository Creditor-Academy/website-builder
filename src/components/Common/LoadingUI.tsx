import { cn } from '@/lib/utils';
import newLogo from '@/assets/Newlogo.svg';

type LoadingProps = {
    className?: string;
    fullScreen?: boolean;
    label?: string;
};

export default function Loading({
    className,
    fullScreen = false,
    label = 'Loading',
}: LoadingProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={label}
            className={cn(
                'flex w-full items-center justify-center overflow-hidden',
                fullScreen
                    ? 'fixed inset-0 h-screen bg-dashboard'
                    : 'min-h-[16rem] flex-1 py-16',
                className,
            )}
        >
            <div className="relative flex flex-col items-center gap-6">
           
                {/* Animated dots loader */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="h-3 w-3 animate-bounce rounded-full bg-[#0F172A] [animation-delay:-0.3s]" />
                    <div className="h-3 w-3 animate-bounce rounded-full bg-[#0F172A] [animation-delay:-0.15s]" />
                    <div className="h-3 w-3 animate-bounce rounded-full bg-[#0F172A]" />
                </div>

                {/* Loading text with shimmer effect */}
                <div className="relative overflow-hidden">
                    <span className="text-sm font-medium uppercase tracking-wider text-[#0F172A]/70">
                        {label}
                    </span>

                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#0F172A]/10 to-transparent" />
                </div>

                {/* Progress bar */}
                <div className="h-0.5 w-48 overflow-hidden rounded-full bg-[#0F172A]/10">
                    <div className="h-full w-0 animate-[progress_2s_ease-in-out_infinite] rounded-full bg-[#0F172A]" />
                </div>

                <span className="sr-only">{label}</span>
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes progress {
                    0% {
                        width: 0%;
                        transform: translateX(0);
                    }
                    50% {
                        width: 70%;
                        transform: translateX(0);
                    }
                    100% {
                        width: 100%;
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}