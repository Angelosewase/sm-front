import type { SVGProps } from "react";

export const Logo = (
  props: SVGProps<SVGSVGElement> & { className?: string }
) => {
  const { className, ...svgProps } = props;

  return (
    <img
      src="/back-free.png"
      alt="Logo"
      className={className}
      {...(svgProps as any)}
    />
  );
};
