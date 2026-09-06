/** Platform information architecture — UI.2 foundation */

export type PlatformNavId = "learn" | "practice" | "challenges" | "progress";

export type PlatformNavItem = {
  id: PlatformNavId;
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

export const PLATFORM_NAV: PlatformNavItem[] = [
  {
    id: "learn",
    label: "Learn",
    href: "/learn",
    match: (p) =>
      p === "/learn" ||
      p === "/labs" ||
      p === "/roadmap" ||
      p === "/code/dsa" ||
      p.startsWith("/code/dsa/") ||
      /^\/(sql|python|spark|databricks|airflow|cloud|system-design|interview-prep)(\/|$)/.test(p) ||
      p.startsWith("/topics/"),
  },
  {
    id: "practice",
    label: "Practice",
    href: "/code",
    match: (p) =>
      (p === "/code" || p.startsWith("/code/")) && !p.startsWith("/code/challenges"),
  },
  {
    id: "challenges",
    label: "Challenges",
    href: "/code/challenges",
    match: (p) => p.startsWith("/code/challenges"),
  },
  {
    id: "progress",
    label: "Progress",
    href: "/progress",
    match: (p) => p === "/progress",
  },
];
