import { cn } from "cn";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect
        x="3"
        y="3"
        width="26"
        height="26"
        rx="7"
        className="fill-primary/12 stroke-primary/25"
        strokeWidth="1.25"
      />
      <path
        d="M9 11h14M9 16h11M9 21h14"
        className="stroke-primary"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="22" cy="16" r="3.5" className="fill-primary/20 stroke-primary" strokeWidth="1.25" />
    </svg>
  );
}
