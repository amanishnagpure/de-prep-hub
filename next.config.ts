import type { NextConfig } from "next";

const labRedirects = [
  "sql",
  "python",
  "spark",
  "databricks",
  "airflow",
  "cloud",
  "system-design",
].flatMap((topic) => [
  { source: `/topics/${topic}`, destination: `/${topic}`, permanent: true },
  { source: `/topics/${topic}-notes`, destination: `/${topic}/notes`, permanent: true },
  { source: `/topics/${topic}-practice`, destination: `/${topic}/practice`, permanent: true },
  { source: `/topics/${topic}-interview`, destination: `/${topic}/interview`, permanent: true },
]);

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...labRedirects,
      { source: "/topics/interview", destination: "/interview-prep", permanent: true },
      { source: "/topics/interview-notes", destination: "/interview-prep/notes", permanent: true },
      { source: "/topics/interview-practice", destination: "/interview-prep/practice", permanent: true },
      { source: "/topics/interview-flashcards", destination: "/interview-prep/interview", permanent: true },
      { source: "/sql/playground", destination: "/sql/practice?tab=playground", permanent: false },
    ];
  },
};

export default nextConfig;
