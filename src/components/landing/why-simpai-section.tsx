import { GraduationCap, Cpu, Zap, ShieldCheck } from "lucide-react";

const advantages = [
  {
    icon: GraduationCap,
    title: "Berbasis Standar Akademik",
    description:
      "Dibangun berdasarkan standar penulisan ilmiah yang diakui secara nasional dan internasional, memastikan artikel Anda memenuhi kriteria publikasi.",
  },
  {
    icon: Cpu,
    title: "AI Multi-Provider",
    description:
      "Memanfaatkan model AI terdepan dari OpenAI, Google Gemini, dan Anthropic Claude untuk analisis yang akurat dan komprehensif.",
  },
  {
    icon: Zap,
    title: "Analisis Real-time",
    description:
      "Dapatkan umpan balik instan tentang struktur, bahasa, dan kesesuaian template artikel Anda dalam hitungan detik.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi Terjamin",
    description:
      "Dokumen Anda diproses dengan aman dan tidak pernah disimpan atau digunakan untuk melatih model AI.",
  },
];

export function WhySimpaiSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Mengapa{" "}
            <span className="text-gradient-primary">SIMPAI</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Keunggulan yang membedakan kami dari tools lainnya
          </p>
        </div>

        {/* Advantage Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {advantages.map((advantage) => (
            <div
              key={advantage.title}
              className="group rounded-xl border-l-4 border-primary bg-card p-8 ring-1 ring-foreground/10 transition-all duration-300 hover:shadow-lg hover:ring-foreground/15"
            >
              <div className="flex items-start gap-5">
                {/* Icon Container */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <advantage.icon className="size-7 text-primary" />
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {advantage.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {advantage.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
