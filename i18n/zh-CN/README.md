<!-- source: README.md sha256:fa2eede0c980 -->
[English](../../README.md) · [한국어](../ko/README.md) · 简体中文 · [日本語](../ja/README.md) · [Tiếng Việt](../vi/README.md) · [ไทย](../th/README.md) · [Bahasa Melayu](../ms/README.md) · [Bahasa Indonesia](../id/README.md)

# EPDS

> **证据优先的产品交付系统**
>
> 一项通用技能，帮助 AI 编码代理基于**证据**，从方向制定到复盘，开展想法、持续服务、程序、游戏和内容自动化项目。

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](../../LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

## 安装

```bash
npx skills add uncaose/epds -a claude-code
```

如需更详细的选项和验证流程，请参阅 [docs/INSTALL.md](docs/INSTALL.md)。

## 它解决什么问题？

AI 编码工具可以在几秒内生成大量代码。然而，产品开发中代价最高的失败，通常并不是“代码写晚了”，而是以下情况。

- 很快做出了真实用户并不想要的功能。
- 在检查用户、业务和运营约束之前，就扩大了实现范围。
- 代码通过了测试并已部署，但真实用户没有完成核心操作。
- 随着功能数量增加，个人信息、成本、性能、支持负担和技术债务也增加了。
- 规划、实现、QA、发布和复盘彼此分离，之前的失败没有反映到下一个任务中。
- 用户不得不决定要向 AI 提什么问题、调用什么角色/技能，以及何时调用。

EPDS 并不是关于“更多代理”或“更长提示词”。它首先确定当前项目所处的位置，并固定 AI 的行动顺序，以找出**下一次决策需要什么证据**。

**[H1] 四个必需元素检查** — 这份 README 是否包含人类原始文本要求的四件事（“定义遇到什么障碍/问题，基于什么推理，并通过应用所选解决方案的过程进行系统且结构化的说明”）？

- [x] **问题** — 上方列表（6 项，包括实际用户不想要的功能，以及未完成但已通过测试的用户行为）
- [x] **依据** — “更多代理/更长提示词不是目标”段落，说明为什么优先考虑证据
- [x] **解决方案应用过程** — [docs/EPDS.md](../../docs/EPDS.md) §0（定义）+ §1~§5（工具、模式和结构审查过程）
- [x] **安装和使用** — 上方 [安装](#安装) 部分 + [docs/INSTALL.md](docs/INSTALL.md)

我是如何走到这里的（查看过的工具、舍弃的模式、依据）→ [docs/EPDS.md](../../docs/EPDS.md)
