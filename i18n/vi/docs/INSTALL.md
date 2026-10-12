<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- completed 2026-09-16 by harness orchestrator from Perplexity thread 6f74f459 (stub in original artifact) -->

# Hướng dẫn Cài đặt

## Các bản cài đặt đã xác minh (2026-09-16)

Cả hai lệnh bên dưới đều đã được chạy và kiểm tra từ đầu đến cuối (checkout repo, liệt kê tệp, diff `CLAUDE.md`/`AGENTS.md`/`settings.json` trước/sau — không thay đổi trong cả hai trường hợp).

| Phương thức | Lệnh | Vị trí cài đặt | Bao gồm | Lệnh slash | Tác động cấu hình toàn cục | Xác minh |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | toàn bộ repo (SKILL.md, adapters, bin, docs, templates) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | không có | xem bên dưới |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/` đầy đủ (toàn bộ arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json cộng với một `templates/README.md` được tạo, không chỉ là con trỏ README), `docs/*.md` (EPDS/ROLES/TESTS/LAYOUT/…), `docs/references/`, `docs/policies/` đầy đủ, `.installed-from.json` | 0 | không có | xem bên dưới |

Khuyến nghị: dùng `skills add` nếu bạn muốn các lệnh slash; npx setup thuần chỉ cung cấp các tệp kỹ năng tối thiểu.

Xác minh sau một trong hai cách cài đặt:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## Tùy chọn A: nguồn GitHub với npx

EPDS ban đầu được dự định chạy trực tiếp từ GitHub, không cần phát hành lên npm registry.

```bash
npx github:uncaose/epds setup
```

Trình cài đặt hỏi kỹ năng Claude Code nên nằm ở đâu.

- Toàn cục: `~/.claude/skills/epds/`
- Dự án: `./.claude/skills/epds/`

Dùng cờ cho cài đặt không tương tác hoặc theo script:

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

Trình cài đặt chỉ sao chép gói EPDS Skill. Nó không cấu hình dự án đích. Để cấu hình một dự án, hãy mở dự án đó trong Claude Code sau khi cài đặt và nói:

```text
EPDS seoljeonghaejwo.
```

## Tùy chọn B: clone và symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

Cập nhật bằng:

```bash
cd ~/Developer/epds
git pull
```

## Tùy chọn C: cài đặt thủ công

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## Xác minh cài đặt

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## Gỡ cài đặt

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

Lệnh gỡ cài đặt chỉ xóa thư mục kỹ năng EPDS đã chọn. Nó không xóa các tệp EPDS đã được một tác nhân cài đặt trước đó vào dự án đích.

## Cấu hình nguồn công khai đáng tin cậy

`epds/trusted-sources.json` ở thư mục gốc của dự án liệt kê các nguồn công khai mà EPDS được phép tìm kiếm
và trích dẫn trước tiên (xem `docs/EPDS.md` § Trusted public sources config). Quản lý tệp này bằng:

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check` báo cáo tệp có tồn tại và là JSON hợp lệ hay không.

## Khắc phục sự cố

### `npx` không thể chạy gói

Kiểm tra phiên bản Node:

```bash
node --version
```

EPDS yêu cầu Node.js 20 trở lên.

### Claude Code không hiển thị EPDS

- Xác nhận tệp tồn tại tại `~/.claude/skills/epds/SKILL.md` hoặc `./.claude/skills/epds/SKILL.md`.
- Bắt đầu một phiên Claude Code mới trong dự án đích.
- Hỏi một cách tự nhiên: `EPDS seoljeonghaejwo.`
- Nếu các lệnh slash không được liệt kê trong runtime của bạn, kích hoạt bằng ngôn ngữ tự nhiên vẫn hoạt động khi kỹ năng đã được tải.

### Kỹ năng EPDS hiện có đã bị thay thế

Trình cài đặt hỏi trước khi thay thế `epds` ở phạm vi đã chọn. Dùng Git clone + symlink nếu bạn muốn có toàn bộ lịch sử và cập nhật dễ dàng.
