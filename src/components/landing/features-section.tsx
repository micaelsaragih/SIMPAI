import {
  FileSearch,
  LayoutTemplate,
  BookOpen,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "primary" | "accent";
}

const features: Feature[] = [
  {
    icon: FileSearch,
    title: "Analisis Struktur",
    description:
      "Pemeriksaan otomatis komponen wajib artikel ilmiah: abstrak, pendahuluan, metodologi, hasil, dan kesimpulan.",
    accent: "primary",
  },
  {
    icon: LayoutTemplate,
    title: "Kesesuaian Template",
    description:
      "Evaluasi format penulisan sesuai standar jurnal target seperti JTIK, JATISI, dan JUTISI.",
    accent: "accent",
  },
  {
    icon: BookOpen,
    title: "Evaluasi Bahasa",
    description:
      "Analisis kualitas bahasa akademik, konsistensi terminologi, dan gaya penulisan ilmiah.",
    accent: "primary",
  },
  {
    icon: BrainCircuit,
    title: "Rekomendasi AI",
    description:
      "Saran perbaikan cerdas berbasis AI untuk meningkatkan kualitas artikel Anda secara keseluruhan.",
    accent: "accent",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Fitur{" "}
            <span className="text-gradient-primary">Unggulan</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Analisis komprehensif untuk artikel ilmiah Anda
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group/feature border-transparent bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20"
            >
              <CardHeader>
                <div
                  className={`mb-2 inline-flex size-12 items-center justify-center rounded-xl ${
                    feature.accent === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <feature.icon className="size-6" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
