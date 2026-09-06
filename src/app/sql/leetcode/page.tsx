import { redirect } from "next/navigation";
import { codeTrackPath } from "@/lib/de-code/constants";

export default function SqlLeetCodePage() {
  redirect(codeTrackPath("sql"));
}
