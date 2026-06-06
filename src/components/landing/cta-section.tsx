import Link from "next/link";

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.48 0.15 160), oklch(0.45 0.12 180), oklch(0.55 0.18 250))",
      }}
    >
      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-10 left-[10%] size-32 rounded-full bg-white/10 animate-pulse-glow" />
        <div className="absolute top-1/2 right-[8%] size-24 rounded-full bg-white/8 animate-pulse-glow [animation-delay:1s]" />
        <div className="absolute bottom-12 left-[30%] size-16 rounded-full bg-white/10 animate-pulse-glow [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[25%] size-20 rounded-full bg-white/6 animate-pulse-glow [animation-delay:0.5s]" />
        <div className="absolute bottom-8 right-[40%] size-12 rounded-full bg-white/8 animate-pulse-glow [animation-delay:1.5s]" />
      </div>

      {/* Content */}
      <div className="section-container relative z-10 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Siap Meningkatkan Kualitas Artikel Ilmiah Anda?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
          Bergabung sekarang dan rasakan kemudahan menulis artikel ilmiah
          dengan bantuan AI.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary transition-all hover:bg-white/90 active:translate-y-px"
          >
            Mulai Sekarang — Gratis
          </Link>
          <Link
            href="mailto:support@simpai.id"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/10 active:translate-y-px"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  );
}
