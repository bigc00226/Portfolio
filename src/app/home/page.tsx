import type { Metadata } from "next";

import { Story } from "@/components/story/Story";
import { story } from "@/data/story";

export const metadata: Metadata = {
  title: story.title,
  description: story.description,
  alternates: { canonical: "/home" },
  openGraph: {
    title: story.title,
    description: story.description,
    url: "/home",
  },
  twitter: {
    title: story.title,
    description: story.description,
  },
};

export default function StoryPage() {
  return (
    <main id="main">
      <Story />
    </main>
  );
}
