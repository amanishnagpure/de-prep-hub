import { notFound } from "next/navigation";
import { ChallengeWorkspace } from "@/components/de-code/challenge-workspace";
import { getChallengeBySlug } from "@/lib/de-code/challenge-bank";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ChallengePage({ params }: PageProps) {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);
  if (!challenge) notFound();
  return <ChallengeWorkspace challenge={challenge} />;
}
