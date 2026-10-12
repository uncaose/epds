<!-- source: README.md sha256:fa2eede0c980 -->
[English](../../README.md) · [한국어](../ko/README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · [Tiếng Việt](../vi/README.md) · ไทย · [Bahasa Melayu](../ms/README.md) · [Bahasa Indonesia](../id/README.md)

# EPDS

> **Evidence-First Product Delivery System**
>
> สกิลทั่วไปที่ช่วยให้ AI coding agents ดำเนินโปรเจกต์ไอเดีย บริการที่กำลังใช้งาน โปรแกรม เกม และระบบอัตโนมัติด้านคอนเทนต์ ตั้งแต่การกำหนดทิศทางไปจนถึงการทบทวน **โดยอิงหลักฐาน**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](../../LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

## การติดตั้ง

```bash
npx skills add uncaose/epds -a claude-code
```

สำหรับตัวเลือกโดยละเอียดและขั้นตอนการตรวจสอบเพิ่มเติม โปรดดูที่ [docs/INSTALL.md](docs/INSTALL.md)

## แก้ปัญหาอะไร?

AI coding tools สามารถสร้างโค้ดจำนวนมากได้ภายในไม่กี่วินาที อย่างไรก็ตาม ความล้มเหลวที่มีต้นทุนแพงที่สุดในการพัฒนาผลิตภัณฑ์มักไม่ใช่ "การเขียนโค้ดช้า" แต่เป็นสิ่งต่อไปนี้

- สร้างฟีเจอร์ที่ผู้ใช้จริงไม่ได้ต้องการอย่างรวดเร็ว
- ขยายขอบเขตการพัฒนาก่อนตรวจสอบข้อจำกัดด้านผู้ใช้ ธุรกิจ และการปฏิบัติการ
- โค้ดผ่านการทดสอบและถูก deploy แล้ว แต่ผู้ใช้จริงไม่ได้ทำ action หลักจนสำเร็จ
- เมื่อจำนวนฟีเจอร์เพิ่มขึ้น ข้อมูลส่วนบุคคล ต้นทุน ประสิทธิภาพ ภาระ support และ technical debt ก็เพิ่มขึ้นด้วย
- การวางแผน การพัฒนา QA การเผยแพร่ และการทบทวนถูกแยกออกจากกัน และความล้มเหลวก่อนหน้าไม่ได้ถูกนำไปสะท้อนในงานถัดไป
- ผู้ใช้ต้องตัดสินใจเองว่าจะถาม AI อะไร จะเรียก role/skill ใด และควรเรียกเมื่อไร

EPDS ไม่ได้เกี่ยวกับ "agents มากขึ้น" หรือ "prompts ที่ยาวขึ้น" แต่เริ่มจากการระบุก่อนว่าโปรเจกต์ปัจจุบันอยู่ตรงไหน แล้วตรึงลำดับการทำงานของ AI เพื่อค้นหาให้ได้ว่า **ต้องมีหลักฐานอะไรสำหรับการตัดสินใจถัดไป**

**[H1] การตรวจสอบองค์ประกอบที่จำเป็น 4 อย่าง** — README นี้มี 4 สิ่งที่ข้อความต้นฉบับของ human ขอไว้หรือไม่ ("Define what obstacle/problem, by what reasoning, and explain systematically and structurally through the process of applying the selected solution")?

- [x] **ปัญหา** — รายการข้างต้น (6 ข้อ รวมถึงฟีเจอร์ที่ผู้ใช้จริงไม่ต้องการ และพฤติกรรมผู้ใช้ที่ยังไม่สำเร็จแม้ผ่านการทดสอบแล้ว)
- [x] **เหตุผล** — ย่อหน้า "More agents/longer prompts are not the goal" อธิบายว่าทำไมจึงให้ความสำคัญกับหลักฐานก่อน
- [x] **กระบวนการประยุกต์ใช้ solution** — [docs/EPDS.md](../../docs/EPDS.md) §0(definition) + §1~§5(tool, pattern, and structure review process)
- [x] **การติดตั้งและการใช้งาน** — ส่วน [การติดตั้ง](#การติดตั้ง) ด้านบน + [docs/INSTALL.md](docs/INSTALL.md)

ฉันมาถึงจุดนี้ได้อย่างไร (เครื่องมือที่ดู pattern ที่ตัดทิ้ง เหตุผล) → [docs/EPDS.md](../../docs/EPDS.md)
