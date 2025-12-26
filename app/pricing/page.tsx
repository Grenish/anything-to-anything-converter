"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useState } from "react";
import { useTier } from "@/components/providers/tier-provider";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Essential tools for casual users.",
    features: [
      "Convert up to 50MB files",
      "Standard Conversion Speed",
      "Standard Support",
      "Access to all 12 formats",
      "Session-based History",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    description: "Perfect for power users who need more.",
    features: [
      "Convert up to 50MB files",
      "Fast Conversion Speed",
      "Priority Support",
      "Access to all 12 formats",
      "Session-based History",
    ],
  },
  {
    name: "Max",
    price: "$19",
    description: "Ultimate power for ultimate needs.",
    features: [
      "Convert up to 50MB files",
      "Lightning Fast Speed",
      "24/7 Dedicated Support",
      "Access to all 12 formats",
      "Session-based History",
    ],
  },
];

export default function PricingPage() {
  const { tier, setTier } = useTier();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newTier, setNewTier] = useState("");

  const handleUpgrade = (selectedTier: string) => {
    if (selectedTier === tier) return;

    setLoadingTier(selectedTier);

    // Simulate loading
    setTimeout(() => {
      setLoadingTier(null);
      setTier(selectedTier as "Free" | "Pro" | "Max");
      setNewTier(selectedTier);
      setShowDialog(true);
      triggerConfetti();
    }, 1500);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div className="min-h-svh w-full bg-secondary/30 flex flex-col items-center py-12 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-serif font-medium">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the plan that's right for you. All plans include our core
          features because transparency is key.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mt-4">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={`relative flex flex-col overflow-visible ${t.name === tier ? "border-primary shadow-lg ring-1 ring-primary" : ""}`}
          >
            {t.name === tier && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{t.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold">{t.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {t.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={t.name === tier ? "outline" : "default"}
                onClick={() => handleUpgrade(t.name)}
                disabled={loadingTier !== null || t.name === tier}
              >
                {loadingTier === t.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : t.name === tier ? (
                  "Current Plan"
                ) : (
                  `Upgrade to ${t.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-2">
              <Sparkles className="w-12 h-12 text-yellow-500 mb-2" />
              <span className="text-2xl">Congratulations!</span>
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You are now a{" "}
              <span className="font-bold text-foreground">{newTier}</span>{" "}
              member.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Enjoy your upgraded experience with fast speeds and priority
              support! (Just kidding, it's exactly the same, but you look cooler
              now 😉)
            </p>
          </div>
          <Button onClick={() => setShowDialog(false)} className="w-full">
            Awesome!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
