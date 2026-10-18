import type { Metadata } from "next";

import { Design } from "@/components/design/Design";
import { design } from "@/data/design";

export const metadata: Metadata = {
  title: design.title,
  description: design.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: design.title,
    description: design.description,
    url: "/",
  },
  twitter: {
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
