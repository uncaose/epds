---
source: https://github.com/obra/superpowers
kind: skill
perspectives: [delivery, agent-ops]
patterns: [skill-habit-framework, tdd-first]
applies_to: [build, verify]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

obra/superpowers — TDD·debugging·collaboration·gyehoek·kodeuribyu·Verificationeul skillro seupgwanhwahaneun peureimwokeu. i sesyeonedo Claude
Code peulreogeuineuro rodeudwae itda(local cache v6.3.0 measured).

**skill-habit-framework**: methodroneul documentga anira teurigeohyeong skill(`test-driven-development`,
`systematic-debugging`, `verification-before-completion`)ro paekijinghae mae jakeopmada jadong sanggisikinda.
rideu: EPDSui evidence-first peurotokoldo "ilkeodumyeon joteun geul"i anira mae myeongryeong front ende gangjedoeneun jeolchayeoya handa.

**tdd-first**: guhyeon jeone silpaehaneun teseuteureul meonjeo sseunda — `docs/TESTS.md` "layer: kodeu"ga i patternui choeso
yoso.

## Measured

`verification-before-completion/SKILL.md`(local peulreogeuin cache
`~/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills/verification-before-completion/SKILL.md`,
2026-09-18 checked) structure: frontmatter(name/description) → "Iron Law"(`NO COMPLETION CLAIMS WITHOUT
FRESH VERIFICATION EVIDENCE`) → 5Stage Gate Function(IDENTIFY→RUN→READ→VERIFY→claim) → Common
Failures pyo(7haeng: tests/linter/build/bug-fix/regression/agent/requirements byeol "mueoti jeunggeoro
chungbunhanga") → Red Flags → Rationalization Prevention pyo → Key Patterns(✅/❌ daebi) → When To Apply.
pailman checked, skill jache run(teurigeo)eun i CLI gyeokri hwangyeongeseo jaehyeon bulga.

## How EPDS uses it

Build/Verify — "saeop pandaneun ppajigo run gyuyulman itda"neun EPDS pyo1ui gyeonggoreul `docs/TESTS.md` 4layergwa daejohaneun
gijun. Common Failures pyoui "jeunggeo vs bulchungbun" ibunbeopi EPDS `evidence-first` peurotokol(exit code·rogeu·silmul
checked eopsi "dwaetda" jujang geumji)ui directly donghyeong.

> "An agentic skills framework & software development methodology that works." — repo
> description(gh api measured 2026-09-16, stars 287306; remeasured 2026-09-18: stars 288320).
