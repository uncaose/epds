# EPDS Tests — 4layergwa baechi

source: human provided by human pyo5(tests 4layer). "teseuteureul tonggwahan kodeureul baepohaetjiman silje sayongjaneun haeksim haengdongeul wanryohaji
motdone"(README "What It Solves")neun silpaeneun kodeu layer teseuteumaneuroneun an japhinda — 4layeri gakgak dareun jilmune
answerhanda.

## 4layer

| layer | jilmun | yesi(domein yesi) | `templates/`·`tests/` baechi |
|---|---|---|---|
| kodeu | hamsuga matge dongjakhaneunga | haeksim gyesan rojik, seontaek/rauting algorijeum | `tests/unit/` — eoneobyeol standard teseuteu reoneo, CIeseo hangsang run |
| gyeyak | deiteo hyeongsiki yuhyohanga | seoljeong/content pail seukima, AI eunganswer JSON seukima | `tests/contract/` + `tools/verify_*`(seukima Verificationgi), silpae si bildeu jungdan |
| gyeongheom | users haeksim floweul wanjuhaneunga | onboding→haeksim gineung→wanryokkaji E2E | `tests/e2e/`(beuraujeo/dibaiseu jadonghwa), `templates/experiment-brief.md`ga flow definitionreul fixed |
| Outcome | jepum yaksoki jikyeojineunga | opeurain dongjak, gaeinjeongbo mijeojang, seongneung yesan, uijonseong not installed si polbaek | `tests/promise/` ttoneun `evals/`(sudong chekeuriseuteu → ganeunghamyeon jadonghwa), `gate-report.md`ga tonggwa evidencereul namgim |

### Do not report when (negative-rule suppression)

| Layer | Do not report when |
|---|---|
| Code | The deviation is in generated, vendored, or unreachable fixture code |
| Contract | The schema change is inside a documented, in-progress dual-read/dual-write migration window |
| Experience | The flow sits behind an inactive feature flag or an explicitly out-of-scope entry point |
| Outcome | The promise was explicitly descoped for this release in `PROJECT-STATE.md` |

Adopt a suppression rule only after verifying on real samples that it does not hide a real defect (open-code-review principle 4, R0295 turn[6]). Never suppress data-loss, permission, or payment-path findings regardless of confidence (principle 5). Record every suppression on `templates/gate-report.md`'s "Suppressed" line.

## layereul geonneottwimyeon saenggineun il

kodeu layerman iteumyeon: keompail/danwi teseuteuneun chorokinde seoljeong paili kkaejyeo baepoga silpaehanda(gyeyak layer bujae).
gyeyak layerkkajiman iteumyeon: seukimaneun yuhyohande users 3beonjjae hwamyeoneseo makhyeo floweul wanju mot handa(gyeongheom layer
bujae). gyeongheom layerkkajiman iteumyeon: floweun wanjudoeneunde opeuraineseo keuraesihageona gaeinjeongboga rogeue namneunda
(Outcome layer bujae) — READMEui "teseuteureul tonggwahan kodeureul baepohaetjiman..." silpaega jeonghwakhi i majimak gangeukida.

## verify keomaendeuwaui gwangye

`verify` keomaendeu(SKILL.md routing table)neun 4layer jeonbueseo "dokrip pumjil jeunggeo"reul moeunda — guhyeonhan saramgwa gateun
sesyeoni anin perspectiveeseo(saengsanja≠Verificationja). `templates/gate-report.md`ga 4layer gakgakui tonggwa/mitonggwawa evidence pail
gyeongroreul girokhaneun gyeyakida.

When verify fans out across multiple reviewers, each reviewer's intermediate reasoning/scratchpad stays local — only concluded findings are shared (context isolation, R0295 turn[12]).

## choeso sijak

sae peurojekteuneun 4layereul han beone da gatchul pilyoga eopsda(Scope discipline, `EPDS.md` §5). kodeu layereun geoui hangsang
day 1buteo; gyeyak layereun deiteo paili saenggineun sunganbuteo; gyeongheom layereun haeksim flowi hwakjeongdoeneun sunganbuteo; Outcome
layereun silje baepo jeon choeso 1gae(gajang wiheomhan yaksok hana)buteo sijakhanda.
