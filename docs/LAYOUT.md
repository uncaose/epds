# EPDS Layout — eijeonteu jungrip koeo + yalbeun eodaepteo

source: human provided by human baechi daieogeuraem(`your-journey/` yesi) + [ai-job-search](references/ai-job-search.md)
structure(pyo3). EPDS jache teuriwa daeeungeul myeongsihanda — "peurompeuteu jal sseugi peurojekteu"ga anira ipryeok·jeolcha·dogu·Verification·
anjeon gyuchiki jeojangso structurero separatedoen local eijeonteu unyeong siseutem(ai-job-search inyong, README).

## human provided by human wonhyeong (domein yesi — wonmun geudaero inyong, direkteorimyeong·skillmyeongeun yesiil ppun EPDS goyu structure not)

```text
your-journey/
├── AGENTS.md  CLAUDE.md  PRODUCT.md  METRICS.md  DECISIONS.md
├── agent/
│   ├── commands/ (discover feature experiment content-pack qa release retro).md
│   ├── skills/<name>/SKILL.md (product-discovery learning-content voice-feedback privacy flutter-delivery cbt-analysis)
│   └── policies/ (privacy release external-inputs).md
├── .claude/commands/ (yalbeun pointeo)  .claude/settings.json
├── .agents/skills/ (runhyeong CLI skill)
├── templates/ evals/ tests/ tools/ docs/ design_handoff_your_journey/
```

## EPDS jache teuri daeeung

| wonhyeong guseong | EPDS jeojangso daeeung | yeokhal |
|---|---|---|
| `AGENTS.md CLAUDE.md PRODUCT.md METRICS.md DECISIONS.md` | install hu peurojekteu ruteue saenggineun `PRODUCT.md PROJECT-STATE.md METRICS.md AGENTS.md CLAUDE.md`(`templates/`ga wonbon) | constitution·jepum maekrak·jeoldae gyuchik |
| `agent/commands/*.md` | `docs/COMMANDS.md` + `adapters/claude-code/commands/*.md` | jaehyeon ganeunghan jeolcha(balgyeon/gineung/silheom/contentpaek/QA/rilriseu/hoego) |
| `agent/skills/<name>/SKILL.md` | i jeojangso jacheui `SKILL.md`(EPDS jasini one skill) | jikmu gyuchik·rauting |
| `agent/policies/*.md` | `docs/policies/*.md`(hyeonjae 12gae pail, `SKILL.md` "Scope and safety rules" jeoleun gyuchik 1munjang+ringkeu indekseu) | anjeon gyeonggye — pstackui wonchik-dokrippail structurereul ttara separate wanryo(`docs/absorb-pstack.md` item 2 — choecho pandan(wonmun geudaero)eun "9gaeppunira jigeum jjogael mankeum banbok gangeuki jeungmyeongdoeji anha boryu"(silje 8gae, 2026-09-28 jeongjeong)yeoteuna, ihu panjeongeseo dokrip pail jachega pyeonjip danwireul jophyeo ribyu·sujeongeul swipge mandeundaneun evidencero sanghyang — test-first/root-cause-not-symptom/premise-review-after-repeated-failure/test-behavior-not-implementation 4gaega ihu paeseueseo chugadwae 8→12gae, wi gwageo girok munguneun geudaero bojon) |
| `.claude/commands/` (yalbeun pointeo) | `adapters/claude-code/commands/*.md`(install si `.claude/commands/`ro boksa) | reontaimbyeol yalbeun eodaepteo |
| `.agents/skills/*/cli` | `bin/epds.mjs`(setup/status/check/sources/models seobeukeomaendeu) | run ganeunghan CLI |
| `templates/` | `templates/*.md`, `*.json` | AIga chaeuneun anjeongdoen chulryeok golgyeok |
| `evals/` | none(upgrade target, `EPDS.md` §5) | AI panjeong pumjil hoegwi bangji |
| `tests/` | none(EPDS jacheen none, install target peurojekteuga soyu — `docs/TESTS.md`) | jisok Verification |
| `tools/` | `bin/epds.mjs check`(setup sanchulmul jonjae·JSON parse Verification) | "saengseongdwaetda"ga anira "usable itda" panjeong |
| `docs/` | `docs/*.md`(i pail poham) | evidence flow·repeoreonseu |
| `design_handoff_*` | none(domain-specific, outside core) | — |

## wonchik: koeoneun eijeonteu jungrip, eodaepteoneun yalbda

`SKILL.md`(what eonje haneunga)neun eoneu AI reontaimedo typessokdoeji anhneunda. `adapters/claude-code/commands/`neun
geu SKILL.mdreul Claude Codeui slash command hyeongsikeuro yalbge gamssagiman handa("Use the installed `epds` skill and
execute the `reference <URL>` procedure." — `adapters/claude-code/commands/epds-reference.md`). sae
reontaim eodaepteoreul chugahal ttaedo SKILL.md bonmuneun does not touch — igeoti [ai-job-search](references/ai-job-search.md)
evaluation gijun pyo7ui "Portability: teukjeong model/IDE eopsi haeksim saengjon"eul manjoksikineun methodida.
