"use client";

import { Command } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useTier } from "@/components/providers/tier-provider";
import { Badge } from "./ui/badge";

export default function Navbar() {
  const { tier } = useTier();

  return (
    <nav className="w-full border-b-2 border-primary bg-background px-6 py-4 flex items-center justify-between fixed top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-primary p-1">
          <Command className="w-4 h-4 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-bold tracking-tight uppercase">
          A2A Converter
        </h1>
      </Link>
      <div className="hidden sm:flex gap-4 items-center">
        <Link href="/docs">
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-primary hover:underline underline-offset-4 rounded-none h-auto py-1 px-2"
          >
            Docs
          </Button>
        </Link>
        <Link href="/pricing">
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-primary hover:underline underline-offset-4 rounded-none h-auto py-1 px-2"
          >
            Pricing
          </Button>
        </Link>

        <Link href="/pricing">
          <Badge
            variant={tier === "Free" ? "secondary" : "default"}
            className="text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-primary/80 transition-colors"
          >
            {tier} Plan
          </Badge>
        </Link>
      </div>
    </nav>
  );
}
