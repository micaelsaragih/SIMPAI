import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/videos/unimed.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay with Emerald Gradient Accent */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-emerald-950/50 to-transparent"
        aria-hidden="true"
      />

      {/* Floating Decorative Elements */}
      <div
        className="absolute top-[15%] left-[8%] size-3 rounded-full bg-emerald-400/30 animate-float"
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] right-[12%] size-5 rounded-full bg-emerald-400/20 animate-float-delayed"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[25%] left-[18%] size-4 rounded-full bg-sky-400/20 animate-float-delayed"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center animate-slide-up">
        {/* Pill Badge */}
        <Badge
          variant="secondary"
          className="mb-6 inline-flex h-7 gap-1.5 rounded-full border border-white/10 bg-white/10 px-4 text-xs font-medium text-white/90 backdrop-blur-sm"
        >
          <Sparkles className="size-3.5" />
          Powered by Advanced AI
        </Badge>

        {/* Main Headline */}
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Sistem Pembimbing
          <br />
          Artikel Ilmiah
        </h1>

        {/* SIMPAI Gradient Accent */}
        <p className="mt-4 text-2xl font-bold tracking-wide md:text-3xl lg:text-4xl">
          <span className="text-gradient-primary">SIMPAI</span>
        </p>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Evaluasi struktur jurnal, kesesuaian template, dan kualitas bahasa
          akademik secara real-time dengan kecerdasan buatan.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-11 gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-primary/25"
            )}
          >
            Mulai Sekarang
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="#features"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 gap-2 rounded-xl border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
            )}
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>
    </section>
  );
}
