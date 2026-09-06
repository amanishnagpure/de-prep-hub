import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Practice",
    template: "%s | Practice",
  },
  description: "LeetCode-style practice platform with judge layer",
};

export default function PracticeSectionLayout({ children }: LayoutProps<"/practice">) {
  return children;
}
