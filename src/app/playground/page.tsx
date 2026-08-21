import type { Metadata } from "next";

import { PlaygroundClient } from "@/components/playground/playground-client";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Try every Canvas UI component on a real landing page. Pick an effect, tune its controls, and watch it run over live HTML.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
