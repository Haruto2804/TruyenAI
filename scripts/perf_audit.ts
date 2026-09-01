import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface PerfMetric {
  target: string;
  type: "SSR_PAGE" | "DB_QUERY";
  durationMs: number;
  sizeKb?: number;
  status: "FAST" | "MODERATE" | "SLOW";
  thresholdMs: number;
}

const metrics: PerfMetric[] = [];

async function measurePage(path: string, thresholdMs = 400) {
  const url = `${BASE_URL}${path}`;
  const start = performance.now();
  try {
    const res = await fetch(url);
    const body = await res.text();
    const duration = Math.round(performance.now() - start);
    const sizeKb = Math.round((Buffer.byteLength(body, "utf8") / 1024) * 10) / 10;
    
    let status: "FAST" | "MODERATE" | "SLOW" = "FAST";
    if (duration > thresholdMs * 1.5) status = "SLOW";
    else if (duration > thresholdMs) status = "MODERATE";

    metrics.push({
      target: path,
      type: "SSR_PAGE",
      durationMs: duration,
      sizeKb,
      status,
      thresholdMs,
    });
  } catch (err: any) {
    console.error(`Error fetching ${path}:`, err.message);
  }
}

async function measureDbQueries() {
  console.log("⚡ [1/2] PROFILING DATABASE QUERY LATENCIES...");

  // 1. Query Novel with all nested relations (Characters, Lores, Chapters count)
  const startStory = performance.now();
  await prisma.story.findUnique({
    where: { slug: "ta-sinh-ra-la-phan-dien" },
    include: {
      characters: true,
      lores: true,
      chapters: { select: { id: true, chapterNo: true, title: true } },
    },
  });
  const storyDuration = Math.round((performance.now() - startStory) * 100) / 100;
  metrics.push({
    target: "Prisma findUnique(Story + Relations)",
    type: "DB_QUERY",
    durationMs: storyDuration,
    status: storyDuration < 30 ? "FAST" : storyDuration < 80 ? "MODERATE" : "SLOW",
    thresholdMs: 30,
  });

  // 2. Query Chapter Content
  const startChapter = performance.now();
  await prisma.chapter.findFirst({
    where: { story: { slug: "ta-sinh-ra-la-phan-dien" }, chapterNo: 1 },
    include: { story: { select: { id: true, title: true, slug: true } } },
  });
  const chapterDuration = Math.round((performance.now() - startChapter) * 100) / 100;
  metrics.push({
    target: "Prisma findFirst(Chapter + Content)",
    type: "DB_QUERY",
    durationMs: chapterDuration,
    status: chapterDuration < 20 ? "FAST" : chapterDuration < 50 ? "MODERATE" : "SLOW",
    thresholdMs: 20,
  });

  // 3. Query All Stories for Homepage
  const startStories = performance.now();
  await prisma.story.findMany({
    include: { _count: { select: { chapters: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const storiesDuration = Math.round((performance.now() - startStories) * 100) / 100;
  metrics.push({
    target: "Prisma findMany(Home Stories Feed)",
    type: "DB_QUERY",
    durationMs: storiesDuration,
    status: storiesDuration < 25 ? "FAST" : storiesDuration < 60 ? "MODERATE" : "SLOW",
    thresholdMs: 25,
  });
}

async function measurePages() {
  console.log("⚡ [2/2] BENCHMARKING SSR PAGES & TTFB LATENCIES...");
  
  // Warm up dev server once
  await fetch(`${BASE_URL}/`).catch(() => {});

  await measurePage("/", 350);
  await measurePage("/truyen/ta-sinh-ra-la-phan-dien", 400);
  await measurePage("/truyen/ta-sinh-ra-la-phan-dien/1", 350);
  await measurePage("/tu-truyen", 300);
}

async function runPerfAudit() {
  console.log("=========================================================");
  console.log("⚡  TRUYENAI PERFORMANCE & SPEED PROFILER");
  console.log("=========================================================");

  await measureDbQueries();
  await measurePages();

  console.log("\n=========================================================");
  console.log("📊 PERFORMANCE BENCHMARK REPORT");
  console.log("=========================================================");

  console.log(
    "Target / Route".padEnd(42) +
    "Type".padEnd(12) +
    "Duration".padEnd(14) +
    "Size (KB)".padEnd(12) +
    "Rating"
  );
  console.log("-".repeat(90));

  let slowCount = 0;
  for (const m of metrics) {
    const icon = m.status === "FAST" ? "🟢 FAST" : m.status === "MODERATE" ? "🟡 ACCEPT" : "🔴 SLOW";
    if (m.status === "SLOW") slowCount++;

    const dur = `${m.durationMs} ms`;
    const size = m.sizeKb !== undefined ? `${m.sizeKb} KB` : "N/A";
    console.log(
      m.target.padEnd(42) +
      m.type.padEnd(12) +
      dur.padEnd(14) +
      size.padEnd(12) +
      icon
    );
  }

  console.log("---------------------------------------------------------");
  if (slowCount === 0) {
    console.log("🏆 PERFORMANCE VERDICT: EXCELLENT (All routes & queries within high-speed thresholds)");
  } else {
    console.log(`⚠️ PERFORMANCE VERDICT: ${slowCount} target(s) exceed optimal thresholds.`);
  }
  console.log("=========================================================\n");

  await prisma.$disconnect();
  return slowCount === 0 ? 100 : 80;
}

if (require.main === module || process.argv[1]?.includes("perf_audit")) {
  runPerfAudit();
}

export { runPerfAudit };
