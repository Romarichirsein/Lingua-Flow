#!/usr/bin/env tsx
import { runSuperAdminDiagnostic } from "../src/lib/diagnostics/superAdminDiagnostic";

async function main() {
  console.log("\x1b[1m\x1b[36m============================================================\x1b[0m");
  console.log("\x1b[1m\x1b[36m  LINGUAFLOW SAAS — SUPER ADMIN MANAGEMENT DIAGNOSTIC SUITE  \x1b[0m");
  console.log("\x1b[1m\x1b[36m============================================================\x1b[0m\n");

  console.log("🚀 Initializing test harness & state synchronization verification...\n");

  const report = await runSuperAdminDiagnostic();

  // Group assertions by step
  const grouped: Record<string, typeof report.assertions> = {};
  for (const assertion of report.assertions) {
    if (!grouped[assertion.step]) {
      grouped[assertion.step] = [];
    }
    grouped[assertion.step].push(assertion);
  }

  for (const [stepName, list] of Object.entries(grouped)) {
    console.log(`\x1b[1m\x1b[34m▶ ${stepName}\x1b[0m`);
    for (const a of list) {
      const icon = a.status === "passed" ? "\x1b[32m✔ PASS\x1b[0m" : "\x1b[31m✖ FAIL\x1b[0m";
      console.log(`  ${icon} \x1b[1m${a.name}\x1b[0m (${a.durationMs}ms)`);
      console.log(`     └─ \x1b[90m${a.message}\x1b[0m`);
      if (a.details) {
        console.log(`     └─ \x1b[33mParams:\x1b[0m \x1b[90m${JSON.stringify(a.details)}\x1b[0m`);
      }
    }
    console.log("");
  }

  console.log("\x1b[1m------------------------------------------------------------\x1b[0m");
  console.log("\x1b[1mDIAGNOSTIC SUMMARY REPORT:\x1b[0m");
  console.log(`  • Total Assertions Executed : \x1b[1m${report.totalTests}\x1b[0m`);
  console.log(`  • Tests Passed              : \x1b[32m\x1b[1m${report.passedCount}\x1b[0m`);
  console.log(`  • Tests Failed              : ${report.failedCount > 0 ? `\x1b[31m\x1b[1m${report.failedCount}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
  console.log(`  • Execution Duration        : \x1b[33m${report.totalDurationMs}ms\x1b[0m`);
  console.log(`  • Synchronous State Health  : ${report.isHealthy ? "\x1b[32m\x1b[1m100% OPERATIONAL\x1b[0m" : "\x1b[31m\x1b[1mDEGRADED\x1b[0m"}`);
  console.log("\x1b[1m------------------------------------------------------------\x1b[0m\n");

  if (!report.isHealthy) {
    console.error("\x1b[31m❌ Diagnostic finished with failures. Please review the failed assertions above.\x1b[0m");
    process.exit(1);
  } else {
    console.log("\x1b[32m✨ All Super Admin School Management flows and reactive synchronization tests passed successfully!\x1b[0m\n");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Diagnostic execution error:", err);
  process.exit(1);
});
