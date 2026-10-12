<!-- rewritten 2026-09-16: conclusion-compressed version → evidence flow. human panjeong("only conclusions, no flow") reflected.
     original conclusion form(69jul, completed 2026-09-16 from Perplexity thread 6f74f459)ui §Components/Whyneun §4ro idong, no deletion.
     rebuild-2 (2026-09-18, H119 §0 subject replacement y): subject = "blocking conclusion-only artifacts"(b) → "collection→comparison→selection→definition process"(a).
     the original §0 sentence was not deleted and was moved below to "Failure Recognition" section. zero-deletion discipline(internal rebuild retrospective §6, private orchestrating-project notes not part of this public repo). -->

# EPDS Architecture — what it blocks and why this form

## §0. what EPDS is and why this

> **EPDS neun — without a person finding and choosing skills one by one**`[H1]` **— if existing material exists, analyze it and extract "state, position, next
> direction"eul and if not, "what do you want"reul mutgo**`[H13]`**, with each of those questions "Status, wichi, the final outcome and
> that direction"eul make progressively more concrete**`[H16]` **recompose the whole and derive the next step**`[H14]`**, geugeoteul "I manually
> am not doing it" directly runhae**`[H11]` **the product "complete the run and produce the product"**`[H6]` **tool. evidence
> the bundled document is not a separate rule but "as a result of the process" is created**`[H41]`**.**
>
> *(English)* EPDS is a tool that — instead of a person hunting through skills one by one `[H1]` —
> analyzes existing evidence to produce "state, position, next direction" when material exists, or
> asks "what do you actually want" when it doesn't `[H13]`; sharpens "state, position, final outcome,
> and direction" with every single answered question `[H16]`; reassembles the whole picture to pick
> the next step `[H14]`; and then executes that itself rather than leaving it for the owner to do by
> hand `[H11]` — carrying the product through to completion `[H6]`. Evidence-attached documents are
> not a separate discipline — they fall out as a product of the process itself `[H41]`.

`[H]` Locator: separate orchestrating haneseu peurojekteu(private, outside this public EPDS repository)ui internal
origin source tag pointing to origin threads/task logs — geu peurojekteuneun is not a public repository, so paths are not cited
(origin-v2 raw-thread neun `[H1]`~`[H40]` used only through — newly assigned to avoid collision `[H41]` newly assigned).

1. **problem** `[H1]` — "wi perspectivee ttareun skilleul ilili naega chataseo sanghwange matge sayonghandaneungeon hal suneun itgetjiman
   silje jeokjeolhi sayonghandaneungeon eoryeoun ilida. ..." sanghwangmada sarami skill·haneseureul goreuneun geoti byeongmokida.
2. **scope** `[H6]` — games, short-form content, or English learning as one method with the same procedure no matter where it starts "complete the run and produce the product" one
   method. Therefore EPDS is not a domain skill bundle.
3. **method** `[P6]`(raw-thread-full.md:2027, proposal) → `[H8]`(raw-thread-full.md:2440, adopted) — `direction → problem →
   hypothesis → minimum experiment → spec → build → verify → release → observe → retro`. each stage is judged by "whether a document exists"ga anira "next
   whether there is evidence reliable enough to move to the next stage"ro panjeonghanda.
4. **evidence first** `[H9]` instruction → `[P9]`(raw-thread-full.md:3007-3016) formalized — read repositories, tests, and metrics first,
   if insufficient, research public material, ask at most five things that cannot be known externally. full eight-stage text = below "Evidence Priority".
5. **two tracks** `[P8]`(raw-thread-full.md:2628) + `[H10]` approval("`choetypes definition`neun matda") — product/business(users
   really want it and return)gwa technical/delivery(safe, reliable, and maintainable)eul diagnose separately. next action = weaker
   one smallest action that advances the track.
6. **execution form** `[H11]` → `[H36]`(2round reconfirmation) — "I manually am not doing it … proceed with minimum/fit/full setup
   want you to do it"(H11) / "it is close to an instruction sheet. If so, you should handle it directly"(H36). no instruction sheet for a person to follow.
7. **approved final definition** `[H10]`("`choetypes definition`neun matda") — `[P9]` verbatim: "for an idea or ongoing project,
   first diagnose the current evidence state, from repositories, documents, tests, metrics, user material, and when needed reliable internet material
   collect information, ask the user only for business decisions that cannot be known externally, needed to pass the current bottleneck
   select the minimum skills, agents, and tools to the product complete product delivery from direction through retro as a general-purpose AI product delivery harness."
8. **name** `[H13]`·`[H14]`·`[H15]` — "Playbook → EPDS". harness raneun requires a unique name that does not conflict with the generic term.

evidence: [tech-bridge-ai](references/tech-bridge-ai-code-quality.md) — YouTube video subtitles that triggered the origin(`[H1]`
attached just before the utterance). even perfect code can leave the product insufficient — code correctness and product evidence are separate questions.

### Evidence Priority (8Stage, `[P9]` restored)

`raw-thread-full.md:3007-3015` verbatim — EPDS 4itemsui "evidence first"eul formalizedhan 8Stage. lowest(8) = AI inference.

1. actual user behavior data, revenue/cost, incident records, interview observations
2. E2E, CI, performance, security, and privacy checks in the real deployment environment
3. repository code, specs, ADRs, issues, and commits
4. constraints and intent explicitly stated by the user
5. official docs, official policies, and original-author material
6. reliable research, benchmarks, and industry material
7. community, blogs, and experience reports
8. AI inference

### Failure Recognition (old §0, 2026-09-16 written — moved, not deleted)

EPDSneun "AIga make fast and much"reul does not block. **artifacts that have only conclusions and have lost the evidence leading to them**eul makneunda
([tech-bridge-ai](references/tech-bridge-ai-code-quality.md): even perfect code can leave the product insufficient — kodeu
jeonghwakseonggwa jepum jeunggeoneun byeolgae jilmun). compressed conclusions cannot be reverified, jaeVerificationhal su eopsneun gyeolroneun next silpaeeseo
geudaero banbokdoenda. geuraeseo EPDSui all artifacts "what(what)"as well as "why this and not the alternative(why not
the alternative)"reul leave in the same file.

`[O]` notation principle: origin([H])not in(determinism/LLM boundary, file:line requirement, UNMEASURED three-way split, exit comparison)eun `[O]` ro
mark i §0 do not place in — full text = "Harness extensions (not in origin)"(§6).

```text
Direction → Problem → Hypothesis → Minimum Experiment → Spec → Build → Verify → Release → Observe → Retro
```
`[P6]`(raw-thread-full.md:2027, proposal) → `[H8]`(raw-thread-full.md:2440, adopted).

## §1. Reviewed Perspectives — tool comparison and rationale

*corresponding table: pyo1 tool comparison(internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

EPDSreul before designing actually compared four perspectives([gstack](references/gstack.md),
[superpowers](references/superpowers.md), [ouroboros](references/ouroboros.md), custom router
= [argo](references/argo-internal.md) actual case):

| perspective | core role | fit | reason |
|---|---|---|---|
| gstack | role-based product development sprint(CEO→dijain→DX→enjinieoring→QA→Security→baepo) | very high | reproducible because the order is fixed as commands — but many commands and heavy initial flow |
| Superpowers | development methodology(TDD·debugging·collaboration)eul skill that habituates | high | execution discipline is strong, but business judgment(what and why to build)i is missing — EPDSga geu front end(Direction~Hypothesis)eul fills |
| Ouroboros | spec-execute-evaluate-memory eijeonteu OS, ambiguity gate+evolution loop | conditionally high | concepts(gate/convergence)eun strongly overlap, but, initial MVPe "eijeonteu OS" putting the whole thing in place stops product development itself |
| custom router(argoryu) | business/product metrics(retention/conversion/cost)reul embedded into decision criteria | very high long-term | a general catalog cannot make domain judgments — but building only this from the beginning is overdesign |

**wae EPDSneun i net jung hanareul geudaero sseuji anhgo johaphaetneunga**: gstackui "sunseoga keomaendeu"reul 骨格ro,
Superpowersui "seupgwanhwadoen Verification skill"eul Build/Verifye, Ouroborosui "geiteuga got jinhaeng jogeon"eul evidence-first
peurotokol(jilmun 5gae iha)ro yakhwa chayonghago, "custom router"neun peurojekteumada PRODUCT.md/METRICS.mdreul chaeuneun
geoteuro wiimdone — EPDS jachega saeop pandaneul daesin naeriji anhneunda(Scope discipline, §5 see).

## §2. reviewed patterns 10 — chosen combination and rejected items

*corresponding table: pyo4 alternative/supplemental patterns 10types(internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

humani provided by alternative/supplemental patterns 10types jung, EPDSga what EPDS actually uses and deliberately rejects:

| pattern | chosen/rejected | reason |
|---|---|---|
| Spec-driven | chosen | `templates/feature-spec.md`, `spec` keomaendeu — needed for complex features, document>guhyeon risk is Scope disciplineoffset by |
| Test-first/Proof-carrying | chosen(partial) | `verify` keomaendeuga handles, but EPDS itself does not force a test framework — `docs/TESTS.md` see |
| Planner–Executor–Reviewer | chosen | `build`(executor)wa `verify`(independent reviewer perspective)reul reflected in the separated command structure |
| Router–Specialist | chosen | work classification(`WORK-ROUTER.md`: TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH)ga router, roles are `docs/ROLES.md` |
| Artifact-first | chosen | all artifacts = files(PRODUCT.md/PROJECT-STATE.md/tempeulrit) — does not leave only chat conclusions |
| Policy-as-code | chosen(weakly) | Scope/safety rulesreul SKILL.mde written explicitly, CI enforcement belongs to the project(gwonjang, not mandatory) |
| Prompt-first | rejected | lack of reproducibility/verification is EPDSga exactly the failure EPDS tries to prevent |
| Command/Skill-first(standalone) | partly adopted | too-many-commands fatiguereul to avoid command count to 14limited to(SKILL.md routing table) |
| Event-driven agent | rejected(deferred) | control/cost issue — CI silpae/baepo monitoring automation is for the project to add directly, EPDS not placed in core |
| Eval-driven | partly adopted | `docs/TESTS.md` "Outcome" layer·`evals/`ga damdang, golden set design is deferred until upgrade time |

## §3. reference repository structure — ai-job-searchwhat was taken from

*corresponding table: pyo3 ai-job-search structure mapping + pyo7 reference repository evaluation criteria(internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

[ai-job-search](references/ai-job-search.md)neun humani directly "is this a normal level pattern for AI use"rago
was the target asked about. answer: no — most AI-use repositories only have prompts, ai-job-searchneun **ipryeok·jeolcha·dogu·
Verification·anjeon gyuchikeul jeojangso structurero separate**done(pyo3, `docs/LAYOUT.md`e full mapping table). EPDSga what EPDS took:

- constitution(CLAUDE.md/AGENTS.md)gwa execution procedures(commands)reul separate — "what is always followed"wa "what is done this time"reul
  do not mix in the same file.
- verification tools(`tools/verify_*`)neun "AI reviewed it"ga anira must be executable judgments — `verify` keomaendeuui
  "independent quality evidence collection"i follows this principle directly.
- templates are stable skeletons filled by AI, not, things redesigned each time.

## §4. EPDS converged into EPDS composition

*corresponding table: pyo2 agency-agents roles/artifacts + pyo6 roles/artifacts by stage 9Stage(internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b) — pyo6 i §0 10Stage rupeuui direct prototype.*

```text
EPDS Skill
  ├── Evidence protocol
  ├── Delivery state model
  ├── Natural-language work router
  ├── Setup/status/audit/upgrade/reference operations
  ├── Delivery commands
  ├── Templates as output contracts
  ├── Specialist guidance
  └── Safety and approval rules

Target project after setup
  ├── PRODUCT.md  PROJECT-STATE.md  METRICS.md  AGENTS.md  CLAUDE.md
  ├── epds/  templates/  specs/  decisions/  docs/  tests/  evals/  tools/
```

### two tracks diagnosis

Provenance: `[P8]`(raw-thread-full.md:2628 "jeuk haneseuneun gisul teuraekgwa jepum teuraekeul separatehae bwaya hapnida") + `[H10]`
approval("`choetypes definition`neun matda" — two trackseul pohamhan §0 definition jeonchereul approval). gu pyogi `[O] harness orchestration written`eun withdrawn
(internal origin-analysis notes (private orchestrating-project, not in this repo) D-12).

| Track | Core question | Examples of evidence |
|---|---|---|
| Product/business | Does this create a real, repeatable user outcome? | Behavior, interviews, experiments, retention, conversion, cost reduction |
| Technical/delivery | Does it work safely, reliably, and maintainably? | Tests, E2E, performance, security/privacy checks, staging, rollback |

next action = two tracks jung weaker geiteureul gajang jakeun danwiro mineun geot.

### Evidence rules

the repository and real user/operational data outrank general advice. `epds/trusted-sources.json`(base entries 5gae
+ §1~§3eseo cited 8gae, idneun `epds sources list` see)i "when and for what public sources are used"ui config
canonical sourceida. CLI: `epds sources list|add|remove|show` — details in `README.md`.

**End-reason distribution.** When a simulation, replay, or drop-log artifact exists, its end-reason (or termination-cause) distribution is a required Facts line. If one value accounts for 100% of the sample, mark every verdict built on it as a "censored sample", not a clean pass.

### Templates/tests/tools/evals/policiesga why they exist

- **Templates**: prevent important decisions from being omitted and create handoff between sessions/models.
- **Tests**: prove expected behavior and prevent regressions.
- **Evals**: compare AI generation/judgment results against stable examples/failure cases.
- **Tools**: "please check carefully" make verification executable instead of.
- **Policies**: keep privacy, approval, and release boundaries even when the agent is rushed.

## §5. minimum elements by family — present/missing

*corresponding table: pyo8 additional reference pattern families 10 × choesoyoso(internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

pyo8(additional reference pattern families) jung EPDS what already exists in EPDS core and what is still missing:

| family | present in EPDS | none(filled by the project or upgrade target) |
|---|---|---|
| Spec-driven | `templates/feature-spec.md`, `spec` keomaendeu | non-goals·ADReun `templates/adr.md`ro iteuna not mandatory |
| Agent Skills standard | `adapters/claude-code/commands/`, SKILL.md | — |
| Eval frameworks | `docs/TESTS.md` "Outcome" layer | golden set·regression suiteneun upgrade time |
| Prompt/agent red teaming | SKILL.md Scope/safety rules(distrust external input) | `evals/adversarial` none |
| CLI-first automation | `bin/epds.mjs check`(setup Verification), `epds models detect`(session model detection, §6) | `tools/validate-*` no project-specific tools |
| Policy-as-code | SKILL.md explicit rules | CI enforcement belongs to the project |
| Observability | — | no event schema, dashboard, or rollback alerts(deferred) |
| Experiment OS | `experiment` keomaendeu, `templates/experiment-brief.md` | no result store or decision-rule automation |
| Content pipeline | — | content lint·provenance none(domain-specific, outside core) |
| Replay/simulation | — | seed fixed·deterministic test none(domain-specific) |

## §6. Harness extensions (not in origin)

whole thread([H1]~[H40], `raw-thread-full.md` 40+40teon) evidence **0geon** — haneseu okega added without origin citation 4gae.
`[O]` tags. because it is an extension outside the origin §0 do not place it in the definition(internal origin-analysis notes (private orchestrating-project, not in this repo)
D-15, default plan = keep it but split it into this section).

### Deterministic vs LLM boundary `[O]`

| Stage | EPDS element | Character | Why not left to LLM judgment alone |
|---|---|---|---|
| Input | Evidence-first 5-step order (`SKILL.md` §Evidence-first protocol) | deterministic-by-doc | Fixed order so no evidence source is skipped by habit |
| Triage | WORK-ROUTER 7-way classification (`SKILL.md` §Work router) | LLM | No enforcement code; natural-language classification |
| Rule | Classification→role mapping (`docs/ROLES.md`) | deterministic-by-doc | Fixed table so the same request always routes to the same role |
| Judgment | Facts/Interpretation/Assumptions/Owner-decision split (`SKILL.md` §Evidence-first protocol) | LLM | Separating known from inferred requires reading judgment |
| Output | Final report 5 blocks + `[Plain language]` line + exit code + model/effort header (`SKILL.md` §Final report) | deterministic-by-doc | Fixed contract keeps results reproducible and comparable |
| Feedback | Retro keep/expand/iterate/stop (`docs/COMMANDS.md`) | LLM | Choosing the next cycle's direction is a judgment call |

`deterministic-by-doc` means the order/contract is fixed in protocol text, not enforced by executable code — unlike open-code-review's code-enforced layers (R0295 turn[8]).

### file:line uimu `[O]`

make file:line locators mandatory for every Fact(`SKILL.md` §Final report, H111 `09e64dd` — open-code-review ui
"line correction" pattern borrowed). do not write sentences without locators.

### UNMEASURED 3bunhwa `[O]`

record measurement failure as environment(environment issue) / censored(sample bias) / corrupted(data corruption) 3three categories
(`SKILL.md` §Evidence-first protocol, H106 `7b92c30`). lumped "unmeasured" 1do not merge into one.

### exit code gigye daejo `[O]`

every command leaves exit code + model/effort header(`SKILL.md` §Final report, H106). FAIL eun bandeusi non-zero
exit to work as a gate — "done" claim alone is not PASS ga no.

### session model detection `[O]`

`bin/models.mjs`(`epds models detect [--write]|list|set`, H154) — pstackui setup-pstack(sesyeoneseo usable
detect available models itself and assign by role)i EPDSe eopsdeon real gapieotdaneun filled the re-review conclusion with code
(`docs/absorb-pstack.md` item 3). gamjineun public CLI names(`claude`/`codex`/`cursor-agent`/`agent`(conditional — actual path "cursor"reul only when it includes,
because the name overlaps another tool, N2)/`opencode`/`gemini`/`aider`/`ollama`/`lms`, PATH presence only)gwa standard
provider env var *name*man bonda — values are never
read(salaitneun jagyeokjeungmyeongeul memorie ilkeo deulyeotdaga beorineun dongjak jachega rogeu·chulryeokeuro saeeonagal wiheomeul
mandeulgo, not reading them blocks that risk at the source). local aliases of a specific project(ye: `gamedev-coder`)eun
do not hardcode(EPDSneun portable public skill, SKILL.md:24). role↔model mapping(`roles`)eun gamjiga jadongeuro
chaeuji anhgo `epds models set <role> <id>[,<id>...] [--effort <value>]`ro sets explicitly — pstackui
"yeokhalbyeol baejeong"eun kodeuga anira saram/LLMi chaeuneun deiteoro namginda("put only the frame in"). `set`eun gak `id`ga hyeonjae
`detected` mokroke itneunji validate(if comma list 2two or more stored as array), `__proto__`/`constructor`/
`prototype`eul as role name, `env:*` idreul reject as role value(non-zero exit — `env:*`neun "usable itneun kiga
itda"only proves not an identity a panel can actually run). `--effort <value>`neun geu yeokhalui reasoning
effort as self-report `effort[role]`e namginda(no value validation — EPDSneun teukjeong providerui effort eohwireul gangjehaji
anhneunda). `detect --write`neun each time `detected`reul replace entirely(yejeon meosin/sesyeonui stale itemsi mergero
yeonggu janryuhaji anhge), roles pointing to ids no longer detected are warned then `null` handled. Outcomeneun
`epds/models.json`(session/machine-local state — `saveModels()`ga geu jarieseo `epds/.gitignore`(`models.json`
one line)reul writes together, target project root `.gitignore`neun does not touch — `epds/trusted-sources.json`gwa
unlike a project-committed shared "canonical source"i no). cheot sobicheo: `/verify`ga `roles.critic`/`roles.reviewers`reul
ilkeo gyochaVerification paeneoleul guseonghanda(`docs/COMMANDS.md` `/verify` ↳ panel).

router jadongbunryu(poteto-mode)neun gajyeooji anhneunda — WORK-ROUTER 7bunryu(§Work router)ga imi donggeup gineungigo
`docs/ROLES.md`ui bunryu→yeokhal maepingkkaji deo gatchwotda(jaesuip=duplicate, `docs/absorb-pstack.md` item 1).

## Scope discipline

EPDSneun uidojeokeuro jakge sijakhanda. peurojekteuneun 1ilchae modeun keomaendeu·yeokhal·doguga pilyohaji anhda. gwanchaldoen banbok
gangeukina myeonghwakhi jeungmyeongdoen byeongmoki iteul ttaeman guseongyosoreul chugahanda.
