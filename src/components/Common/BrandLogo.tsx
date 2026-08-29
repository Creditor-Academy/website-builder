import { cn } from '@/lib/utils';
import newLogo from '@/assets/Newlogo.svg';

type BrandLogoProps = {
  className?: string;
  imgClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  alt?: string;
};

export function BrandLogo({
  className,
  imgClassName,
  wordmarkClassName,
  showWordmark = true,
  alt = 'Buildora',
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)}>
      <img
        src={newLogo}
        alt={showWordmark ? '' : alt}
        className={cn('h-8 w-8 shrink-0 object-contain', imgClassName)}
      />
      {showWordmark && (
        <span className={cn('truncate font-bold tracking-tight', wordmarkClassName)}>
          Buildora
        </span>
      )}
    </span>
  );
}
