import { ImageResponse } from "next/og"

export const alt = "SIMPAI — Sistem Pembimbing Artikel Ilmiah"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#ffffff",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-20%",
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-20%",
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Academic icon badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            marginBottom: "30px",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
        </div>

        {/* Branding */}
        <h1
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            letterSpacing: "-0.05em",
            margin: "0 0 10px 0",
            background: "linear-gradient(to right, #ffffff, #a7f3d0)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          SIMPAI
        </h1>

        <p
          style={{
            fontSize: "28px",
            color: "#9ca3af",
            fontWeight: "500",
            margin: "0 0 40px 0",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Asisten Cerdas Penulisan & Kepatuhan Template Artikel Ilmiah
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              fontSize: "16px",
              color: "#a7f3d0",
              fontWeight: "600",
            }}
          >
            ✓ Deteksi Struktur Jurnal
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              fontSize: "16px",
              color: "#a7f3d0",
              fontWeight: "600",
            }}
          >
            ✓ Pengecekan PUEBI & KBBI
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              fontSize: "16px",
              color: "#a7f3d0",
              fontWeight: "600",
            }}
          >
            ✓ Analisis AI Multi-Model
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
