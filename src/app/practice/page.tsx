import type { Metadata } from "next";
import { PracticeSectionShell } from "@/components/practice/practice-section-shell";
import { PracticeSectionPicker } from "@/components/practice/practice-section-picker";

export const metadata: Metadata = {
  title: "Practice",
  description: "Choose SQL, Spark, Python, or DSA practice",
};

export default function PracticeSectionPage() {
  return (
    <PracticeSectionShell>
      <PracticeSectionPicker />
    </PracticeSectionShell>
  );
}
