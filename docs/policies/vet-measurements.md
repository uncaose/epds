# Vet a measurement before acting on it

Before reporting or acting on a measured performance number (speed, throughput, latency or resource use), check what limited it, that every side ran with production-like settings, that it stays within physical limits, that errors were counted, that it repeats, that it matters to the real workload, and that the work actually ran; under shared-host contention, record the result as inconclusive.

Apply each check below that fits the measurement or the project's facilities (a single reading has no comparison side; a hand count has no harness). For any check that does not apply, say so in the report with the reason, instead of skipping it silently.

Write down the sentence you expect to claim first ("export is 30% faster at the median on the large dataset"), read the measuring script, where there is one, to see what it times and what it skips, then test that sentence:

- **Limiter.** Name what bounded the number (one core, disk, network, a lock, the load generator itself). Where the project has a profiler, profile in a separate run, because profilers slow the work. If a change did not move the number, the limiter usually explains why.
- **Settings.** Every side runs the way production runs it: release build, production flags, the same versions and data, caches as warm or cold as real use. A side left on defaults compares configurations, not implementations; tune it before naming a winner.
- **Limits.** Do the arithmetic against bandwidth, cores and the share of time the changed part took. Removing a part that takes 10% of the run cannot make it much more than 10% faster; a result past a limit measured a cache, a no-op or a bug.
- **Errors.** Count failures and wrong outputs, not just responses. Fast rejections and slow retries both distort a number.
- **Repeatability.** Run each side several times, alternating sides, and report median and range. A gap smaller than the run-to-run spread is no measurable difference.
- **Relevance.** Next to any micro result, measure the end-to-end path a user waits on and give the micro result as a share of it.
- **It ran.** Confirm the work happened inside the timed region (rows written, request reached the server, result used) rather than a cached, skipped, lazy or timed-out result.

Lead the report with the verdict: for a comparison, faster, slower, no measurable difference, or inconclusive; for a single reading, the number itself (or inconclusive); then the number with unit, run count, range and limiter. Call it inconclusive when the limiter is unknown, a side ran untuned, or errors and "it ran" were not checked. A one-run ballpark is acceptable only when asked for, labelled as one run, and still checked for errors and that the work ran; a choice between options is never a ballpark.

On a shared machine, attribute CPU and memory only to the process tree the measurement itself started; other load on the host is context, not a cause. When outside contention makes the number impossible to attribute, keep the result as inconclusive rather than calling it a regression or a failure of the work under test.

**Why**: A number travels further than its caveats. An untuned side, an uncounted error or work that never ran produces a clean-looking figure that drives a wrong decision, and the cost of checking these few questions is far smaller than the cost of acting on the wrong figure. (docs/absorb-pstack.md — pstack's `benchmark-checklist` skill, `skills/benchmark-checklist/SKILL.md` at `cursor/plugins` commit `a5539b1`, 2026-11-12; restated in EPDS's own words, not copied.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
