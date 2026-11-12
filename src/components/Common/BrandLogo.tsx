import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  imgClassName?: string;
  showIcon?: boolean;
  showWordmark?: boolean;
  alt?: string;
};

export function BrandLogo({
  className,
  imgClassName,
  showIcon = true,
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
      {showIcon && (
        <img
          src="/assets/logo.png"
          alt={showWordmark ? '' : alt}
          className={cn('h-10 w-10 shrink-0 object-contain', imgClassName)}
        />
      )}
      {showWordmark && (
        <span className="truncate text-xl font-bold leading-snug tracking-tight text-current sm:text-2xl">
          Web Studio
        </span>
      )}
    </span>
  );
}
