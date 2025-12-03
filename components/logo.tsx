'use client'
import { useState } from "react";
import type { SVGProps } from "react";

export const Logo = (
  props: SVGProps<SVGSVGElement> & { className?: string, url: string }
) => {
  const { className, url, ...svgProps } = props;

  const [imgSrc, setImgSrc] = useState(url);

  const handleError = () => {
    // If the image fails to load, use the fallback image
    setImgSrc("/back-free.png");
  };


  return (
    <img
      src={imgSrc}
      alt="Logo"
      className={className}
      onError={handleError}
      {...(svgProps as any)}
    />
  );
};
