import { cn } from '@/lib/utils';
import newLogo from '@/buildora.webp';

type BrandLogoProps = {
  className?: string;
  imgClassName?: string;
  showWordmark?: boolean;
  alt?: string;
};

export function BrandLogo({
  className,
  imgClassName,
  showWordmark = true,
  alt = 'Web Studio',
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex min-w-0 items-center gap-2.5 text-slate-800 dark:text-white',
        className,
      )}
    >
      {/* <img
        src={newLogo}
        alt={showWordmark ? '' : alt}
        className={cn('h-8 w-8 shrink-0 object-contain rounded-lg', imgClassName)}
      /> */}
      {showWordmark && (
        <span className="truncate text-xl font-bold leading-snug tracking-tight text-current sm:text-2xl">
          Web Studio
        </span>
      )}
    </span>
  );
}
