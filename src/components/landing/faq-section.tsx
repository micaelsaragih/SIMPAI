"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Apa itu SIMPAI?",
    answer:
      "SIMPAI (Sistem Pembimbing Artikel Ilmiah) adalah platform berbasis web yang menggunakan kecerdasan buatan untuk membantu mahasiswa dan peneliti mengevaluasi kualitas artikel ilmiah mereka. Platform ini menganalisis struktur, bahasa akademik, dan kesesuaian template jurnal secara otomatis.",
  },
  {
    question: "Format file apa saja yang didukung?",
    answer:
      "Saat ini SIMPAI mendukung file dalam format .docx (Microsoft Word) dan .pdf. Kami terus mengembangkan dukungan untuk format lainnya.",
  },
  {
    question: "Apakah SIMPAI gratis?",
    answer:
      "SIMPAI menyediakan paket gratis dengan kuota analisis terbatas. Untuk penggunaan lebih intensif, tersedia paket premium dengan fitur tambahan dan kuota yang lebih besar.",
  },
  {
    question: "Bagaimana keamanan dokumen saya?",
    answer:
      "Keamanan dokumen adalah prioritas utama kami. Semua file yang diunggah dienkripsi dan diproses secara aman. Dokumen tidak pernah disimpan secara permanen atau digunakan untuk tujuan lain.",
  },
  {
    question: "AI model apa yang digunakan?",
    answer:
      "SIMPAI menggunakan arsitektur multi-provider yang mendukung model dari OpenAI (GPT-4), Google (Gemini), dan Anthropic (Claude) untuk memberikan analisis yang paling akurat dan komprehensif.",
  },
  {
    question: "Apakah SIMPAI bisa menggantikan dosen pembimbing?",
    answer:
      "Tidak. SIMPAI dirancang sebagai alat bantu pendamping, bukan pengganti dosen pembimbing. Platform ini membantu mempercepat proses revisi awal sehingga waktu bimbingan dapat digunakan untuk diskusi yang lebih substantif.",
  },
];

export function FaqSection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        {/* Accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/60 py-1"
              >
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="pb-4 leading-relaxed">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
