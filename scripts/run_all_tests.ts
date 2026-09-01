import { runSecurityAudit } from "./security_audit";
import { runPerfAudit } from "./perf_audit";
import { runLoadTest } from "./load_test";

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════════╗");
  console.log("║     🏰  TRUYENAI FULL ENTERPRISE QUALITY & SECURITY SUITE        ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  const startTime = performance.now();

  // 1. Security Audit
  const secScore = await runSecurityAudit();

  // 2. Performance Profiler
  const perfScore = await runPerfAudit();

  // 3. Multi-User Load Test (15 VUs, 60 Requests)
  const loadScore = await runLoadTest(15, 60);

  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log("==================================================================");
  console.log("📋  FINAL MASTER QUALITY AUDIT REPORT");
  console.log("==================================================================");
  console.log(`🛡️  Security Score:       ${secScore}% (${secScore >= 90 ? "GRADE A+" : "GRADE B"})`);
  console.log(`⚡  Performance Score:    ${perfScore}% (${perfScore === 100 ? "OPTIMIZED" : "ACCEPTABLE"})`);
  console.log(`🚀  Load / Capacity Score: ${loadScore}% (${loadScore === 100 ? "HIGH RESILIENCE" : "MODERATE"})`);
  console.log(`⏱️  Total Audit Runtime:   ${totalTime} seconds`);
  console.log("==================================================================");

  if (secScore >= 80 && perfScore >= 80 && loadScore >= 80) {
    console.log("🎉 ALL QUALITY SUITES PASSED! TruyenAI is Production-Ready.\n");
    process.exit(0);
  } else {
    console.log("⚠️ Some suites require optimization before production deployment.\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Master Audit Runner Error:", err);
  process.exit(1);
});
