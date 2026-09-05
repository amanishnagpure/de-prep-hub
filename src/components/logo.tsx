import { cn } from "cn";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="32"
        height="32"
        rx="10"
        className="fill-primary/15 stroke-primary/25"
        strokeWidth="1"
      />
      <path
        d="M10 12h8M10 18h12M10 24h9"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="25" cy="18" r="5" className="stroke-primary" strokeWidth="2" />
      <path
        d="M23 18h4M25 16v4"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="25" cy="18" r="1.5" className="fill-primary" />
    </svg>
  );
}
