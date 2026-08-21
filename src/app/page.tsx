import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { MockSite } from "@/components/playground/mock-site";
import { HexFloat } from "@/lib/HexFloat/HexFloat";

export const metadata: Metadata = {
  title: "DJ EZe 🎧",
  description: "AI DJ mixing with you!",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* <DocsSidebar /> */}

      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-border/40 bg-background/70 px-5 pt-4 pb-3 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
        <Link href="/" aria-label="Canvas UI home">
          <Image
            src="/logo.svg"
            alt="Canvas UI"
            width={104}
            height={21}
            priority
            className="dark:invert-0"
          />
        </Link>
        <DocsMobileNav />
      </div>

      <HexFloat
        size={160}
        gap={0}
        bevel={1.5}
        tilt={24}
        perspective={0.5}
        float={0}
        speed={1}
        shine={0.5}
        lift={0.1}
        radius={1200}
        flow={0}
        swirl={0}
        trail={0}
        iridescence={1}
        bloom={0}
        grain={0.8}
        gapColor="auto"
        className="page-enter inset-0 z-30"
        style={{ position: "fixed" }}
      >
        <div className="min-h-full bg-background px-5 pt-20 pb-10 sm:px-8">
          <MockSite />
        </div>
      </HexFloat>
    </main>
  );
}
