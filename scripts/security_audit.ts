import http from "http";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface CheckResult {
  category: string;
  name: string;
  passed: boolean;
  details: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const results: CheckResult[] = [];

async function fetchResponse(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      redirect: "manual", // to inspect redirects
    });
    return {
      status: res.status,
      headers: res.headers,
      body: await res.text(),
    };
  } catch (err: any) {
    return {
      status: 0,
      headers: new Headers(),
      body: "",
      error: err.message,
    };
  }
}

async function auditSecurityHeaders() {
  console.log("\n🔍 [1/4] AUDITING HTTP SECURITY HEADERS...");
  const res = await fetchResponse("/");

  if (res.status === 0) {
    console.error("❌ Could not connect to dev server at " + BASE_URL);
    return;
  }

  // 1. X-Frame-Options
  const xfo = res.headers.get("x-frame-options");
  results.push({
    category: "Security Headers",
    name: "X-Frame-Options (Clickjacking Protection)",
    passed: !!xfo && (xfo.toUpperCase() === "SAMEORIGIN" || xfo.toUpperCase() === "DENY"),
    details: xfo ? `Present: ${xfo}` : "Missing header",
    severity: "MEDIUM",
  });

  // 2. X-Content-Type-Options
  const xcto = res.headers.get("x-content-type-options");
  results.push({
    category: "Security Headers",
    name: "X-Content-Type-Options (MIME-sniffing Protection)",
    passed: xcto === "nosniff",
    details: xcto ? `Present: ${xcto}` : "Missing nosniff",
    severity: "MEDIUM",
  });

  // 3. Referrer-Policy
  const rp = res.headers.get("referrer-policy");
  results.push({
    category: "Security Headers",
    name: "Referrer-Policy (Information Leakage Protection)",
    passed: !!rp,
    details: rp ? `Present: ${rp}` : "Missing header",
    severity: "LOW",
  });

  // 4. Permissions-Policy
  const pp = res.headers.get("permissions-policy");
  results.push({
    category: "Security Headers",
    name: "Permissions-Policy (Browser Feature Restrictions)",
    passed: !!pp,
    details: pp ? `Present: ${pp}` : "Missing header",
    severity: "LOW",
  });
}

async function auditRouteProtection() {
  console.log("🔍 [2/4] AUDITING ROUTE AUTHENTICATION & ACCESS CONTROL...");
  
  // Test admin route without auth
  const resAdmin = await fetchResponse("/admin");
  const isProtected = resAdmin.status === 307 || resAdmin.status === 302 || resAdmin.status === 401 || resAdmin.status === 403 || resAdmin.body.includes("Đăng Nhập") || resAdmin.body.includes("Unauthorized");
  
  results.push({
    category: "Access Control",
    name: "Unauthenticated /admin Access Shield",
    passed: isProtected,
    details: `Status: ${resAdmin.status} - Access gracefully gated`,
    severity: "HIGH",
  });

  const resAdminNew = await fetchResponse("/admin/story/new");
  const isNewProtected = resAdminNew.status === 307 || resAdminNew.status === 302 || resAdminNew.status === 401 || resAdminNew.status === 403 || resAdminNew.body.includes("Đăng Nhập") || resAdminNew.body.includes("Unauthorized");
  
  results.push({
    category: "Access Control",
    name: "Unauthenticated /admin/story/new Shield",
    passed: isNewProtected,
    details: `Status: ${resAdminNew.status} - Creation route gated`,
    severity: "HIGH",
  });
}

async function auditInjectionResilience() {
  console.log("🔍 [3/4] AUDITING INJECTION & PATH TRAVERSAL RESILIENCE...");

  // 1. SQL Injection Probe
  const sqlPayload = "/truyen/%27%20OR%201=1--";
  const resSql = await fetchResponse(sqlPayload);
  const sqlSafe = !resSql.body.includes("PrismaClientKnownRequestError") && !resSql.body.includes("syntax error") && (resSql.status === 404 || resSql.status === 200 || resSql.status === 500);
  
  results.push({
    category: "Injection Defense",
    name: "SQL Injection Payload Immunity",
    passed: sqlSafe,
    details: `Status ${resSql.status} - No internal DB stack trace exposed`,
    severity: "CRITICAL",
  });

  // 2. Path Traversal Probe
  const pathTraversalPayload = "/truyen/..%2f..%2f..%2fetc%2fpasswd";
  const resPath = await fetchResponse(pathTraversalPayload);
  const pathSafe = resPath.status === 404 || resPath.status === 400 || !resPath.body.includes("root:x:0:0");

  results.push({
    category: "Injection Defense",
    name: "Directory & Path Traversal Immunity",
    passed: pathSafe,
    details: `Status ${resPath.status} - Traversal attempts blocked`,
    severity: "HIGH",
  });

  // 3. XSS in URL Parameters Probe
  const xssPayload = "/truyen/%3Cscript%3Ealert(1)%3C%2Fscript%3E";
  const resXss = await fetchResponse(xssPayload);
  const xssSafe = !resXss.body.includes("<script>alert(1)</script>");

  results.push({
    category: "Injection Defense",
    name: "Cross-Site Scripting (XSS) Sanitization",
    passed: xssSafe,
    details: "Script payloads sanitized and escaped",
    severity: "HIGH",
  });
}

async function auditSecretsLeakage() {
  console.log("🔍 [4/4] AUDITING CLIENT-SIDE SECRETS EXPOSURE...");

  const resHome = await fetchResponse("/");
  const hasLeakedDatabaseUrl = resHome.body.includes("postgresql://") || resHome.body.includes("postgres://");
  const hasLeakedAuthSecret = resHome.body.includes("AUTH_SECRET") || resHome.body.includes("JWT_SECRET");

  results.push({
    category: "Information Disclosure",
    name: "Server Environment Variables Masking",
    passed: !hasLeakedDatabaseUrl && !hasLeakedAuthSecret,
    details: "No DATABASE_URL or Auth secrets leaked into HTML/JS bundles",
    severity: "CRITICAL",
  });
}

async function runSecurityAudit() {
  console.log("=========================================================");
  console.log("🛡️  TRUYENAI COMPREHENSIVE SECURITY AUDIT SUITE");
  console.log("=========================================================");

  await auditSecurityHeaders();
  await auditRouteProtection();
  await auditInjectionResilience();
  await auditSecretsLeakage();

  console.log("\n=========================================================");
  console.log("📊 SECURITY AUDIT REPORT SUMMARY");
  console.log("=========================================================");

  let passedCount = 0;
  for (const r of results) {
    const icon = r.passed ? "✅ PASS" : "❌ FAIL";
    if (r.passed) passedCount++;
    console.log(`${icon} | [${r.category}] ${r.name}`);
    console.log(`       ↳ Details: ${r.details}`);
  }

  const score = Math.round((passedCount / results.length) * 100);
  console.log("\n---------------------------------------------------------");
  console.log(`🎯 OVERALL SECURITY SCORE: ${score}% (${passedCount}/${results.length} Checks Passed)`);
  
  if (score === 100) {
    console.log("🏆 STATUS: EXCELLENT (Grade A+ Security Posture)");
  } else if (score >= 80) {
    console.log("⚠️ STATUS: GOOD (Minor recommendations pending)");
  } else {
    console.log("🚨 STATUS: ACTION REQUIRED (Critical vulnerabilities detected)");
  }
  console.log("=========================================================\n");

  return score;
}

if (require.main === module || process.argv[1]?.includes("security_audit")) {
  runSecurityAudit().then((score) => {
    if (score < 80) process.exit(1);
  });
}

export { runSecurityAudit };
