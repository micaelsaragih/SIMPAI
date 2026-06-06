import { Upload, FileCheck, BarChart3 } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Unggah Draf",
    description:
      "Upload artikel ilmiah Anda dalam format yang didukung untuk memulai analisis.",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Pilih Template",
    description:
      "Pilih template jurnal target untuk evaluasi kesesuaian format dan struktur.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Terima Analisis",
    description:
      "Dapatkan laporan analisis lengkap beserta rekomendasi perbaikan dari AI.",
  },
] as const

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Cara Kerja</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tiga langkah sederhana menuju artikel ilmiah berkualitas
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Connector lines — visible only on md+ */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-8 right-0 left-0 hidden md:block"
          >
            {/* Line between step 1 and step 2 */}
            <div className="absolute left-[calc(33.333%/2+2rem)] right-[calc(100%-33.333%*1.5+2rem)] top-0 border-t-2 border-dashed border-primary/30" />
            {/* Line between step 2 and step 3 */}
            <div className="absolute left-[calc(33.333%*1.5+2rem)] right-[calc(33.333%/2+2rem)] top-0 border-t-2 border-dashed border-primary/30" />
          </div>

          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="group flex flex-col items-center text-center"
              >
                {/* Numbered Circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>

                {/* Description */}
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
