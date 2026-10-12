---
source: https://github.com/Q00/ouroboros
kind: tool
perspectives: [agent-ops, delivery]
patterns: [ambiguity-gate, evolve-loop]
applies_to: [direction, spec, retro]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

Q00/ouroboros — spec-execute-evaluate-memoryeul doneun eijeonteu OS(Python CLI `ooo`, 13gae reontaim eodaepteo). seonhaeng josa
= `~/Projects/research/R0229-ouroboros-agent-os-survey`(2026-08-29, gh api+WebFetch measured). pyo1eseo
"conditionally high"(unyeong bokjapdo·jayulseong riseukeuro initial MVPen gwado)euro chaejeomdoen evidence EPDSui "jakge sijak" wonchik
(Scope discipline)eul ganghwahanda.

**ambiguity-gate**: mohoseong jeomsuga imgyegaps(≤0.2)eul neomji mothamyeon runeul makneunda. rideu: EPDSui "owner-only
jilmun 5gae iha" gyuchikgwa donghyeong mokjeok(mohohameul run jeone sojin) — daman ouroborosneun suchi geiteu, EPDSneun jilmun geiteu.

**evolve-loop**: sedae(generation)mada ontolroji yusado 95% suryeomkkaji banbok Improvement. rideu: EPDSui retro Stagega
"keep/expand/iterate/stop" gyeoljeong gyuchikeuro daeeunghajiman, ouroboroscheoreom jadong banbok typesgyeol jogeoneun ajik eopsda — gaepeuro
namginda.

## Measured

gijon install checked(2026-09-18, `ooo --version` = 0.51.17, PyPI `ouroboros-ai`ga anira siseutem `pip3 show`en
an japhineun gyeokri venv/pipx install — `which ooo` = a user-local `~/.local/bin/ooo`, not a system path). `ooo qa
<b3.diff> -t code -q "..."` run: **codex baekendeu(gibon) exit 1** — "You've hit your usage limit ...
try again at Sep 21st, 2026 3:14 AM"(kodekseu kwoteo sojin, silsayong bulga checked). `ooo config backend gemini`ro
jeonhwan hu jaerun: **exit 1** — `ModelNotFoundError: models/claude-opus-5 is not found`(local gemini-cli
seoljeongi jalmotdoen model IDreul sangsok — hwangyeong oguseong, ooo jache gyeolham not). baekendeureul `codex`ro wonbokhae sesyeon Status
bokgu(2026-09-18 19:36). du baekendeu modu measured QA panjeong mihoekdeuk — "hwangyeong michungjok"euro girok.

## How EPDS uses it

Direction/Spec — ambiguity-gate·evolve-loop patterneul EPDSui owner-question geiteu·retro rupeu seolgyee
chamjoyongeuroman reflected(reontaim uijon not). `ooo qa`neun hubo QA baekendeuro reviewhaeteuna, i hwangyeongeseoneun du baekendeu
modu jeuksi sayong bulga(kwoteo/seoljeong) — adopted boryu.

> "Pins an acceptance spec and omits any verify command or expected output from the worker's
> contract." — pyproject.toml description(R0229 raw/c6, 2026-08-29 kaepcheo; stars remeasured 2026-09-18:
> 6020, at registration 5933).
