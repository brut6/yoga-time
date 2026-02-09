import React, { useState, useEffect } from 'react';

interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80";

export const ImageWithFallback = ({ src, alt, className, fallbackSrc, ...props }: Props) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc || DEFAULT_FALLBACK);
    }
  };

  return (
    <img
      src={imgSrc || DEFAULT_FALLBACK}
      alt={alt || "Image"}
      className={className}
      onError={handleError}
      style={{ objectFit: 'cover', ...props.style }}
      {...props}
    />
  );
};