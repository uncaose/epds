# EPDS Roles — Stagebyeol haeksim jilmun·roles/artifacts

source: [agency-agents](references/agency-agents.md) yeokhal katalrogeu(eonje·sanchulmul·useonsunwi) +
human provided by human pyo6(roles/artifacts by stage), du pyoreul byeonghap. EPDSneun i pyoreul "yeokhaleul fixed baejeong"i anira "i Stageeseo
i jilmune answerhal ttae seehal perspective"euro sseunda — peurojekteue jeondam inryeok/eijeonteuga eopseumyeon oneoga directly geu jilmune
answerhanda.

## Stage → jilmun → yeokhal → sanchulmul

| Stage | haeksim jilmun | see yeokhal(domein yesi) | sanchulmul | useonsunwi |
|---|---|---|---|---|
| balgyeon(Direction/Problem) | i gineung eopsido haegyeol ganeunghan Real probleminga | jepum gihoek, sayongja riseochi | problem definition, JTBD, gaseol, daean | very high |
| pandan(Hypothesis) | jigeum mandeul gachiga itneunga | jepum gihoek, hyeonsil jeomgeom(Reality Checker) | useonsunwi, scope, seonggong/jungdan gijun | very high |
| silheom(Experiment) | gajang ssago ppareun Verificationeun | silheom chujeok, sayongja riseochi | silheom beuripeu, ibenteu, inteobyu gyehoek | high |
| seolgye(Spec) | haeksim sayongja floweul kkaeji anhneunga | UX, peulraetpom guhyeon(domein yesi: mobail/eumseong) | peulrou, polbaek, non-goals | high |
| guhyeon(Build) | gajang jakeun anjeonhan byeongyeongeun | guhyeon damdang, choesobyeongyeong wonchik damdang | guhyeon gyehoek, byeongyeong mokrok | high |
| boho(Build/Verify) | gaeinjeongbo·ki·nokeum·donggihwaga anjeonhanga | peuraibeosi/Security damdang | deiteo flow, geumji jeojangso, geomsa items | high(mingam deiteo daruneun peurojekteu) |
| Verification(Verify) | users kkeutkkaji floweul wanjuhaneunga | teseuteu jadonghwa | E2E/hoegwi/seongneung | very high |
| chulha(Release) | silje baepo hwangyeongeul tonggwahaetneunga | hyeonsil jeomgeom(dokrip panjeong) | GO / CONDITIONAL GO / NO-GO | very high |
| hakseup(Observe/Retro) | mueoti siljero hyogwa iteotna | silheom chujeok, jepum gihoek | jipyo summary, next gyeoljeong | high |
| seongjang(Growth, seontaek) | yuip·jeonhwaneul eotteotge neulrina | content/hoekdeuk damdang | raending/mesiji, content silheom, hoekdeuk jipyo | najung(public beta ihu) |

## yeokhaleul "eonje hochulhaneunga" — persona-catalog pattern

[agency-agents](references/agency-agents.md)ui rideu: yeokhaleul bureuneun geot jachega Artifact contracti doege handa.
EPDSeseo ineun `WORK-ROUTER.md`ui work classificationwa jjakeul irunda — bunryuga STRATEGIC/SENSITIVEmyeon wi pyoeseo
"pandan"·"boho" haengui jilmune meonjeo answerhaeya BUILDro neomeoganda.

| WORK-ROUTER bunryu | meonjeo answerhaeya hal pyoui haeng |
|---|---|
| TRIVIAL | none(baro guhyeon+teseuteu) |
| FEATURE | seolgye(non-goals checked) |
| EXPLORATORY | balgyeon(guhyeon geumji, problem definitionbuteo) |
| STRATEGIC | pandan(oneo approval jeon guhyeon geumji) |
| SENSITIVE | boho(wiheom review+oneo approval) |
| RELEASE | chulha(dokrip GO/NO-GO) |
| GROWTH | seongjang(cheukjeong ganeunghan silheom meonjeo) |

## domein yesi juui

wi "see yeokhal" yeolui guche name(mobail/eumseong/content deung)eun yesida. EPDSneun teukjeong peulraetpom·saneope typessokdoeji anhneunda
— peurojekteumada PRODUCT.mde jagi domeinui guche yeokhal nameeul chaewo neotneunda.
