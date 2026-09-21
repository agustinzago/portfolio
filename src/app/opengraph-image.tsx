import { ImageResponse } from "next/og";
import { BANNER } from "@/lib/banner";
import { cv } from "@/lib/cv";

export const alt = `${cv.name} — ${cv.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CELL = 16;
const CELL_H = 27; // integer height avoids subpixel seams between rows

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0b0d10",
          color: "#d5d9e0",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#7ee787", fontSize: 14, marginBottom: 24 }}>agustin@zago:~$ whoami</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {BANNER.map((row, y) => (
            <div key={y} style={{ display: "flex" }}>
              {[...row].map((c, x) => (
                <div
                  key={x}
                  style={{
                    width: CELL,
                    height: CELL_H,
                    background: c === "█" ? "#7ee787" : c === " " ? "transparent" : "#2f5a38",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 36 }}>{cv.name}</div>
        <div style={{ display: "flex", fontSize: 26, color: "#6e7681", marginTop: 8 }}>{cv.title}</div>
        <div style={{ display: "flex", fontSize: 20, color: "#79c0ff", marginTop: 32 }}>curl agustinzago.com</div>
      </div>
    ),
    size,
  );
}
