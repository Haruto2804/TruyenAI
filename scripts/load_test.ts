const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface RequestSample {
  url: string;
  durationMs: number;
  status: number;
  success: boolean;
}

const ROUTES = [
  { path: "/", weight: 0.35 },
  { path: "/truyen/ta-sinh-ra-la-phan-dien", weight: 0.25 },
  { path: "/truyen/ta-sinh-ra-la-phan-dien/1", weight: 0.2 },
  { path: "/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", weight: 0.15 },
  { path: "/tu-truyen", weight: 0.05 },
];

function pickRandomRoute(): string {
  const rand = Math.random();
  let cumulative = 0;
  for (const route of ROUTES) {
    cumulative += route.weight;
    if (rand <= cumulative) return route.path;
  }
  return ROUTES[0].path;
}

async function singleWorkerRequest(path: string): Promise<RequestSample> {
  const url = `${BASE_URL}${path}`;
  const start = performance.now();
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const durationMs = Math.round(performance.now() - start);
    return {
      url: path,
      durationMs,
      status: res.status,
      success: res.status >= 200 && res.status < 400,
    };
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    return {
      url: path,
      durationMs,
      status: 0,
      success: false,
    };
  }
}

async function runConcurrencyBatch(concurrency: number, totalRequests: number): Promise<RequestSample[]> {
  const samples: RequestSample[] = [];
  let dispatched = 0;
  let finished = 0;

  async function worker() {
    while (dispatched < totalRequests) {
      dispatched++;
      const path = pickRandomRoute();
      const sample = await singleWorkerRequest(path);
      samples.push(sample);
      finished++;
      if (finished % 10 === 0 || finished === totalRequests) {
        process.stdout.write(`\r🚀 Simulating traffic: ${finished}/${totalRequests} requests completed (${Math.round((finished / totalRequests) * 100)}%)...`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, totalRequests) }, () => worker());
  await Promise.all(workers);
  console.log(); // new line

  return samples;
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

async function runLoadTest(concurrency = 15, totalRequests = 60) {
  console.log("=========================================================");
  console.log("🚀  TRUYENAI MULTI-USER CONCURRENCY LOAD TEST");
  console.log("=========================================================");
  console.log(`⚙️  Parameters: ${concurrency} Concurrent Virtual Users | ${totalRequests} Total Requests`);
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log("---------------------------------------------------------");

  // Pre-warm routes
  await fetch(`${BASE_URL}/`).catch(() => {});
  await fetch(`${BASE_URL}/truyen/ta-sinh-ra-la-phan-dien`).catch(() => {});
  await fetch(`${BASE_URL}/truyen/ta-sinh-ra-la-phan-dien/1`).catch(() => {});

  const startTime = performance.now();
  const samples = await runConcurrencyBatch(concurrency, totalRequests);
  const totalElapsedSec = (performance.now() - startTime) / 1000;

  const successful = samples.filter((s) => s.success);
  const failed = samples.filter((s) => !s.success);
  const durations = samples.map((s) => s.durationMs);

  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const sum = durations.reduce((acc, d) => acc + d, 0);
  const mean = Math.round(sum / durations.length);
  const p50 = calculatePercentile(durations, 50);
  const p90 = calculatePercentile(durations, 90);
  const p95 = calculatePercentile(durations, 95);
  const p99 = calculatePercentile(durations, 99);

  const rps = Math.round((samples.length / totalElapsedSec) * 10) / 10;
  const errorRate = Math.round((failed.length / samples.length) * 1000) / 10;

  console.log("\n=========================================================");
  console.log("📊 LOAD & CONCURRENCY BENCHMARK RESULTS");
  console.log("=========================================================");
  console.log(`⏱️  Total Duration:     ${totalElapsedSec.toFixed(2)} seconds`);
  console.log(`📈  Throughput (RPS):    ${rps} requests/sec`);
  console.log(`✅  Successful Requests: ${successful.length}/${samples.length} (${(100 - errorRate).toFixed(1)}%)`);
  console.log(`❌  Failed Requests:     ${failed.length} (${errorRate}%)`);
  console.log("---------------------------------------------------------");
  console.log("📉  LATENCY PERCENTILES:");
  console.log(`    • Min:      ${min} ms`);
  console.log(`    • Mean:     ${mean} ms`);
  console.log(`    • P50 (Med):${p50} ms`);
  console.log(`    • P90:      ${p90} ms`);
  console.log(`    • P95:      ${p95} ms`);
  console.log(`    • P99:      ${p99} ms`);
  console.log(`    • Max:      ${max} ms`);
  console.log("---------------------------------------------------------");

  if (errorRate === 0 && p95 < 1200) {
    console.log("🏆 LOAD TEST VERDICT: PASSED (Zero errors, high-speed multi-user handling)");
  } else if (errorRate < 2) {
    console.log("⚠️ LOAD TEST VERDICT: ACCEPTABLE (Minor latency spike under peak concurrent load)");
  } else {
    console.log("🚨 LOAD TEST VERDICT: FAILED (High error rate or severe latency degradation)");
  }
  console.log("=========================================================\n");

  return errorRate === 0 ? 100 : 80;
}

// Parse CLI args if any
const vusArg = process.argv.find((a) => a.startsWith("--vus="))?.split("=")[1];
const reqsArg = process.argv.find((a) => a.startsWith("--requests="))?.split("=")[1];
const vus = vusArg ? parseInt(vusArg, 10) : 15;
const reqs = reqsArg ? parseInt(reqsArg, 10) : 60;

if (require.main === module || process.argv[1]?.includes("load_test")) {
  runLoadTest(vus, reqs);
}

export { runLoadTest };
