<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- เสร็จสิ้นเมื่อ 2026-09-16 โดย harness orchestrator จาก Perplexity thread 6f74f459 (stub ใน artifact ต้นฉบับ) -->

# คู่มือการติดตั้ง

## การติดตั้งที่ตรวจสอบแล้ว (2026-09-16)

คำสั่งทั้งสองด้านล่างถูกเรียกใช้และตรวจสอบตั้งแต่ต้นจนจบแล้ว (repo checkout, file listing, diff ของ `CLAUDE.md`/`AGENTS.md`/`settings.json` ก่อน/หลัง — ทั้งสองกรณีไม่มีการเปลี่ยนแปลง)

| วิธี | คำสั่ง | ตำแหน่งติดตั้ง | สิ่งที่รวมอยู่ | Slash commands | ผลต่อ global config | ตรวจสอบ |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | repo เต็ม (SKILL.md, adapters, bin, docs, templates) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | ไม่มี | ดูด้านล่าง |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/` แบบเต็ม (ทั้งหมดของ arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json รวมถึง `templates/README.md` ที่สร้างขึ้น ไม่ใช่แค่ README pointer), `docs/*.md` (EPDS/ROLES/TESTS/LAYOUT/…), `docs/references/`, `docs/policies/` แบบเต็ม, `.installed-from.json` | 0 | ไม่มี | ดูด้านล่าง |

คำแนะนำ: ใช้ `skills add` ถ้าคุณต้องการ slash commands; ส่วน npx setup แบบธรรมดาจะให้เฉพาะไฟล์ skill ขั้นต่ำเท่านั้น

ตรวจสอบหลังการติดตั้งแบบใดแบบหนึ่ง:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## ตัวเลือก A: GitHub source ด้วย npx

EPDS ตั้งใจให้เริ่มต้นใช้งานโดยตรงจาก GitHub โดยไม่ต้องเผยแพร่ผ่าน npm registry

```bash
npx github:uncaose/epds setup
```

ตัวติดตั้งจะถามว่าควรวาง Claude Code skill ไว้ที่ใด

- Global: `~/.claude/skills/epds/`
- Project: `./.claude/skills/epds/`

ใช้ flags สำหรับการติดตั้งแบบ non-interactive หรือ scripted:

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

ตัวติดตั้งคัดลอกเฉพาะ EPDS Skill package เท่านั้น ไม่ได้ตั้งค่า target project หากต้องการตั้งค่า project ให้เปิดใน Claude Code หลังติดตั้งแล้วพูดว่า:

```text
EPDS seoljeonghaejwo.
```

## ตัวเลือก B: clone และ symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

อัปเดตด้วย:

```bash
cd ~/Developer/epds
git pull
```

## ตัวเลือก C: การติดตั้งแบบ manual

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## ตรวจสอบการติดตั้ง

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## ถอนการติดตั้ง

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

คำสั่งถอนการติดตั้งจะลบเฉพาะไดเรกทอรี EPDS skill ที่เลือกเท่านั้น ไม่ได้ลบไฟล์ EPDS ที่เคยถูก agent ติดตั้งไว้ใน target project ก่อนหน้านี้

## Trusted public sources config

`epds/trusted-sources.json` ที่ project root แสดงรายการ public sources ที่ EPDS ได้รับอนุญาตให้ค้นหา
และ cite ก่อน (ดู `docs/EPDS.md` § Trusted public sources config) จัดการได้ด้วย:

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check` รายงานว่าไฟล์มีอยู่และเป็น JSON ที่ถูกต้องหรือไม่

## การแก้ปัญหา

### `npx` cannot run the package

ตรวจสอบ Node version:

```bash
node --version
```

EPDS ต้องใช้ Node.js 20 หรือใหม่กว่า

### Claude Code does not show EPDS

- ยืนยันว่าไฟล์มีอยู่ที่ `~/.claude/skills/epds/SKILL.md` หรือ `./.claude/skills/epds/SKILL.md`
- เริ่ม Claude Code session ใหม่ใน target project
- ถามแบบธรรมชาติ: `EPDS seoljeonghaejwo.`
- หาก slash commands ไม่ถูกแสดงใน runtime ของคุณ การ trigger ด้วย natural-language ยังทำงานได้เมื่อ skill ถูกโหลดแล้ว

### Existing EPDS skill was replaced

ตัวติดตั้งจะถามก่อนแทนที่ `epds` ใน scope ที่เลือก ใช้ Git clone + symlink หากคุณต้องการประวัติเต็มและการอัปเดตที่ง่าย
