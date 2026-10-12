# Reference Evaluation Rubric — `/epds-reference` 10 items

source: human provided by human pyo7("ai-job-searchcheoreom wanseongdo nopeun jeojangsoreul chata nokyeora"ui evaluation gijun). `/epds-reference
<URL>` (`adapters/claude-code/commands/epds-reference.md`)i oebu jeojangso·dogu·peureimwokeureul bunseokhal ttae i
rubeurikeuro chaejeomhago, choetypes chucheon(Adopt/Adapt/Observe/Reject)ui evidencero gak itemsui joteun/warning signalreul citedda.

## 10 items

| # | evaluation item | check question | good signal | warning signal |
|---|---|---|---|---|
| 1 | Real problem | eotteon banbok eopmu/riseukeureul haegyeolhana | sayong sarye·mokpyo sayongja seonmyeong | "AI tim"man itgo sanchulmul bulmyeong |
| 2 | Artifact contract | Outcomega eotteon pail·seukima·tempeulriteuro namna | YAML/JSON/MD/kodeu gyeyak | chaeting chulryeokman |
| 3 | Verification | AI Outcomereul mueoteuro panjeonghana | lint·test·E2E·keompail·eval·CI | "AI reviewed it" |
| 4 | Tooling | banbok Verificationeul kodeuro haetna | tools/scripts/CLI/CI | peurompeuteueman "checkedhara" |
| 5 | Failure handling | meomchum·jaesido·polbaeki definitiondwaetna | oryu mesiji, hoegwi, rolbaek | seonggong gyeongro demoman |
| 6 | Maintainability | byeongyeong iryeok·giyeoga geonganghanga | rilriseu·isyu·teseuteu·document gaengsin | oraedoen document·kkaejin yeje |
| 7 | Security | bimil·gaeinjeongbo·oebu ipryeok cheori | choeso gwonhan, `.env.example`, seukaen, jeongchaek | kireul paile, oebu peurompeuteu sinroe |
| 8 | Portability | teukjeong model/IDE eopsi haeksimi saengjonhana | dogu jungrip document·CLI·teseuteu | teukjeong chaeting UI typessok |
| 9 | Cost | hochul·API·unyeong Costi tongjedoena | cache·yesan·polbaek·local run | mujehan hochul gajeong |
| 10 | Product linkage | sayongja gachi/saeop jipyoga Improvementdoena | seonggong jipyo·sinario | gaebalja saengsanseong jujangman |

## wiring

`adapters/claude-code/commands/epds-reference.md` step 4("Report the recommendation")neun i 10 items jung
warning signalga checkeddoen itemseul mark, Adopt/Adapt/Observe/Reject pandaneul geu itemse evidencehae sseunda — evidence eopsneun
deunggeupman itneun bogoneun banryeo target(§0 wonchikgwa dongil: gyeolronman itgo flowi eopsneun sanchulmul geumji).

## scoring examples(this 8gae source, summary)

| source | strong items | weak/unconfirmed items |
|---|---|---|
| [gstack](gstack.md) | 1(Real problem), 6(Maintainability: 890 open issues=hwalbal) | 9(Cost: myeongryeong dasu, chogi flow mugeoum) |
| [superpowers](superpowers.md) | 3(Verification: TDD/debugging skill naejang), 8(Portability: 6gae reontaim jiwon) | 10(Product linkage: enjinieoring run pumjil hanjeong) |
| [ouroboros](ouroboros.md) | 4(Tooling: CLI+MCP), 2(gyeyak: acceptance spec) | 9(Cost: meolti LLM provider, yesan unconfirmed), 7(Security: PostHog telremeteuri opt-out unconfirmed — R0229) |
| [ai-job-search](ai-job-search.md) | 2,3,4,7(README pyo3 jeonche) | 6(seuta su daebi silsayong hwaldong miVerification) |

gak sourceui full evidenceneun `docs/references/<slug>.md` see.
