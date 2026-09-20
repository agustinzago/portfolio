import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getCv } from "./cv/route";
import { GET as getExperience } from "./experience/route";
import { GET as getSkills } from "./skills/route";
import { GET as getPlain } from "./cv.txt/route";
import { proxy } from "@/proxy";

describe("API", () => {
  it("GET /api/cv returns the whole cv", async () => {
    const body = await getCv().json();
    expect(body.name).toBe("Agustín Zago");
    expect(body.experience).toHaveLength(5);
  });

  it("GET /api/experience returns roles newest first", async () => {
    const body = await getExperience().json();
    expect(body[0].company).toBe("Brainner");
    expect(body[0].period).toBe("Mar 2026 – Present");
  });

  it("GET /api/skills returns grouped skills", async () => {
    const body = await getSkills().json();
    expect(body.backend).toContain("Redis");
  });

  it("GET /api/cv.txt returns plain text", async () => {
    const res = getPlain();
    expect(res.headers.get("content-type")).toMatch(/^text\/plain/);
    expect(await res.text()).toContain("AGUSTÍN ZAGO");
  });
});

describe("curl trick", () => {
  const req = (ua: string, accept = "*/*") =>
    new NextRequest("https://agustinzago.com/", { headers: { "user-agent": ua, accept } });

  it("rewrites / to /api/cv.txt for curl", () => {
    const res = proxy(req("curl/8.4.0"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("https://agustinzago.com/api/cv.txt");
  });

  it("rewrites for clients that only accept text/plain", () => {
    const res = proxy(req("Mozilla/5.0", "text/plain"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("https://agustinzago.com/api/cv.txt");
  });

  it("leaves browsers alone", () => {
    const res = proxy(req("Mozilla/5.0", "text/html,*/*"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });
});
