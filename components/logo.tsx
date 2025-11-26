import type { SVGProps } from "react";

export const Logo = (
  props: SVGProps<SVGSVGElement> & { className?: string, url: string }
) => {
  const { className,url, ...svgProps } = props;

  return (
    <img
      src={url}
      alt="Logo"
      className={className}
      {...(svgProps as any)}
    />
  );
};
