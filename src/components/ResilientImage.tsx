import { useState } from 'react';
import { HeartHandshake } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  aspectClassName = 'aspect-[4/3]',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${aspectClassName} w-full bg-gradient-to-br from-zinc-100 to-emerald-50/60 border border-zinc-200 flex flex-col items-center justify-center p-6 text-center`}
      >
        <HeartHandshake className="w-8 h-8 text-[#14532D] mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-zinc-800">{fallbackTitle || alt}</p>
        <p className="text-xs text-zinc-500 mt-1">HSA Bunyo Sanctuary, Uganda</p>
      </div>
    );
  }

  return (
    <div className={`${aspectClassName} w-full overflow-hidden bg-zinc-100`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
      />
    </div>
  );
}
