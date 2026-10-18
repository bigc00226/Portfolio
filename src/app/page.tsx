import type { Metadata } from "next";

import { Design } from "@/components/design/Design";
import { design } from "@/data/design";

import { sharedOpenGraph, sharedTwitter } from "./shared-metadata";

export const metadata: Metadata = {
  title: design.title,
  description: design.description,
  alternates: { canonical: "/" },
  openGraph: {
    ...sharedOpenGraph,
    title: design.title,
    description: design.description,
    url: "/",
  },
  twitter: {
    ...sharedTwitter,
    title: design.title,
    description: design.description,
  },
};

export default function DesignPage() {
  return (
    <main id="main">
      <Design />
    </main>
  );
}
