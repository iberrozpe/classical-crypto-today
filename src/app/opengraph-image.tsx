import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b1120",
          color: "#e6ecff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 30,
            fontWeight: 600,
            color: "#35e0c8",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#35e0c8",
            }}
          />
          CLASSICAL CRYPTO TODAY
        </div>
        <div style={{ display: "flex", fontSize: 66, fontWeight: 700, marginTop: 28, lineHeight: 1.15 }}>
          The cryptography running
        </div>
        <div style={{ display: "flex", fontSize: 66, fontWeight: 700, lineHeight: 1.15 }}>
          the internet right now.
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 32, color: "#93a1c4", maxWidth: 820 }}>
          RSA, ECC, AES, TLS — and why post-quantum cryptography is replacing them.
        </div>
      </div>
    ),
    { ...size },
  );
}
