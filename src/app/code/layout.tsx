import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code",
  description: "LeetCode for Data Engineers — SQL, Python, PySpark, DSA",
};

export default function CodeLayout({ children }: LayoutProps<"/code">) {
  return <div className="flex min-h-[calc(100dvh-3rem)] flex-col">{children}</div>;
}
