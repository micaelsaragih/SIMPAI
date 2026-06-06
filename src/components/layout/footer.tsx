import Link from "next/link"
import { SparklesIcon, MailIcon, MapPinIcon } from "lucide-react"

const quickLinks = [
  { href: "#features", label: "Fitur" },
  { href: "#how-it-works", label: "Cara Kerja" },
  { href: "#templates", label: "Template Jurnal" },
  { href: "#faq", label: "FAQ" },
]

const legalLinks = [
  { href: "/privacy", label: "Kebijakan Privasi" },
  { href: "/terms", label: "Syarat & Ketentuan" },
  { href: "/about", label: "Tentang Kami" },
]

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform duration-300 group-hover:scale-110">
                <SparklesIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SIMP<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Sistem Pembimbing Artikel Ilmiah — Platform AI untuk evaluasi dan
              peningkatan kualitas artikel ilmiah Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Universitas Negeri Medan
                  <br />
                  Jl. Willem Iskandar Pasar V, Medan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href="mailto:support@simpai.id"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  support@simpai.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SIMPAI. Hak cipta dilindungi undang-undang.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibangun dengan{" "}
            <span className="text-primary font-medium">Next.js</span> &{" "}
            <span className="text-accent font-medium">AI</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
