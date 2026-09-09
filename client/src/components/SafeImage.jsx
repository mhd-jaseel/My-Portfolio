import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUtils';

/**
 * Reusable SafeImage component with:
 * 1. Zero layout shift (preserves dimensions and aspect ratio).
 * 2. HTML/CSS shimmer loading skeleton.
 * 3. Graceful HTML/CSS fallback placeholder if URL fails or is missing.
 * 4. Zero broken image icon or console errors.
 * 5. Complete absence of any legacy AI placeholder assets.
 */
const SafeImage = ({
  src,
  alt = 'Image',
  className = '',
  containerClassName = '',
  aspectRatio = '16/9',
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  fallbackLabel = 'Image unavailable',
  iconSize = 'w-6 h-6',
  rounded = 'rounded-xl',
  objectFit = 'object-cover',
  style = {},
  onClick,
}) => {
  const resolvedSrc = getMediaUrl(src, '');
  const [hasError, setHasError] = useState(!resolvedSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset state if src changes
  useEffect(() => {
    const url = getMediaUrl(src, '');
    if (!url) {
      setHasError(true);
      setIsLoaded(false);
    } else {
      setHasError(false);
      setIsLoaded(false);
    }
  }, [src]);

  // Fallback Placeholder UI (Pure HTML/CSS)
  if (hasError || !resolvedSrc) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#f4f8ff] border border-[#dce7fa] flex flex-col items-center justify-center p-4 text-center select-none ${rounded} ${containerClassName}`}
        style={{
          aspectRatio: aspectRatio || undefined,
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
          ...style,
        }}
        onClick={onClick}
      >
        <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#1683FF]/20 flex items-center justify-center text-[#1683FF]/60 shadow-xs mb-2">
          <ImageIcon className={iconSize} />
        </div>
        <span className="text-[11.5px] font-medium text-[#7a8a9e] tracking-wide truncate max-w-[90%]">
          {alt && alt !== 'Image' ? alt : fallbackLabel}
        </span>
        <span className="text-[10px] text-[#a0b0c6] tracking-wider uppercase mt-0.5 font-mono">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${rounded} ${containerClassName}`}
      style={{
        aspectRatio: aspectRatio || undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {/* Shimmer loading skeleton underneath image */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#edf3fc] via-[#f7faff] to-[#edf3fc] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-white/60 border border-[#1683FF]/15 flex items-center justify-center text-[#1683FF]/40">
            <ImageIcon className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full ${objectFit} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};

export default SafeImage;
