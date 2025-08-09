import type { SVGProps } from "react";

export function DominionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M12 2v5.5" />
      <path d="M12 17.77V22" />
      <path d="M22 9.27l-4.5 1.4" />
      <path d="M2 9.27l4.5 1.4" />
      <path d="M7 14.14l-2.5 4" />
      <path d="M17 14.14l2.5 4" />
    </svg>
  );
}
