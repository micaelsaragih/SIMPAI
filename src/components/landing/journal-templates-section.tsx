import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const templates = [
  {
    abbr: "JTIK",
    name: "Jurnal Teknologi Informasi & Komunikasi",
    requirements: [
      "Format IMRaD",
      "Abstrak ID & EN",
      "Max 8000 kata",
      "IEEE Citation",
    ],
    accentClass: "border-t-4 border-t-primary",
  },
  {
    abbr: "JATISI",
    name: "Jurnal Teknik Informatika dan Sistem Informasi",
    requirements: [
      "Struktur 6 bagian",
      "Abstrak 150-250 kata",
      "Min 15 referensi",
      "APA Style",
    ],
    accentClass: "border-t-4 border-t-accent",
  },
  {
    abbr: "JUTISI",
    name: "Jurnal Teknik Informatika dan Sistem Informasi",
    requirements: [
      "Format standar",
      "Abstrak bilingual",
      "Template khusus",
      "Vancouver Style",
    ],
    accentClass: "border-t-4 border-t-primary",
  },
  {
    abbr: "Generic",
    name: "Template Jurnal Umum",
    requirements: [
      "Format fleksibel",
      "Struktur dasar",
      "Multi-format",
      "Customizable",
    ],
    accentClass: "border-t-4 border-t-accent",
  },
] as const

export function JournalTemplatesSection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Template Jurnal</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mendukung berbagai standar jurnal ilmiah nasional
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template.abbr}
              className={cn(
                "cursor-default rounded-t-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                template.accentClass
              )}
            >
              <CardHeader>
                <CardTitle className="flex flex-col gap-3">
                  <span className="text-2xl font-bold text-primary">
                    {template.abbr}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground leading-snug">
                    {template.name}
                  </span>
                </CardTitle>
                <div className="pt-1">
                  <Badge variant="secondary">Supported</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2.5">
                  {template.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
