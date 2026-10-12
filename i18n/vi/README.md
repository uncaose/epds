<!-- source: README.md sha256:fa2eede0c980 -->
[English](../../README.md) · [한국어](../ko/README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · Tiếng Việt · [ไทย](../th/README.md) · [Bahasa Melayu](../ms/README.md) · [Bahasa Indonesia](../id/README.md)

# EPDS

> **Evidence-First Product Delivery System**
>
> Một kỹ năng tổng quát giúp các tác nhân lập trình AI thực hiện các dự án ý tưởng, dịch vụ đang vận hành, chương trình, trò chơi và tự động hóa nội dung từ định hướng đến phản tư **dựa trên bằng chứng**.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](../../LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

## Cài đặt

```bash
npx skills add uncaose/epds -a claude-code
```

Để xem các tùy chọn chi tiết hơn và quy trình xác minh, vui lòng tham khảo [docs/INSTALL.md](docs/INSTALL.md).

## Nó giải quyết vấn đề gì?

Công cụ lập trình AI có thể tạo ra rất nhiều mã trong vài giây. Tuy nhiên, những thất bại tốn kém nhất trong phát triển sản phẩm thường không phải là "viết mã muộn", mà là những điều sau.

- Nhanh chóng tạo ra một tính năng mà người dùng thật không muốn.
- Mở rộng phạm vi triển khai trước khi kiểm tra các ràng buộc về người dùng, kinh doanh và vận hành.
- Mã đã vượt qua kiểm thử và được triển khai, nhưng người dùng thật không hoàn thành các hành động cốt lõi.
- Khi số lượng tính năng tăng lên, thông tin cá nhân, chi phí, hiệu năng, gánh nặng hỗ trợ và nợ kỹ thuật cũng tăng theo.
- Lập kế hoạch, triển khai, QA, phân phối và phản tư bị tách rời, và các thất bại trước đó không được phản ánh vào tác vụ tiếp theo.
- Người dùng phải quyết định cần hỏi AI điều gì, gọi vai trò/kỹ năng nào, và gọi khi nào.

EPDS không phải là về "nhiều tác nhân hơn" hay "prompt dài hơn". Trước tiên, nó xác lập dự án hiện tại đang ở đâu, rồi cố định chuỗi hành động của AI để tìm ra **bằng chứng nào cần thiết cho quyết định tiếp theo**.

**[H1] Kiểm tra Bốn Yếu tố Bắt buộc** — README này có chứa bốn điều mà nguyên văn yêu cầu của con người đã nêu không ("Xác định trở ngại/vấn đề là gì, bằng lập luận nào, và giải thích một cách có hệ thống và có cấu trúc thông qua quá trình áp dụng giải pháp đã chọn")?

- [x] **Vấn đề** — Danh sách ở trên (6 mục, bao gồm các tính năng mà người dùng thật sự không muốn, và các hành vi người dùng chưa hoàn tất nhưng đã vượt qua kiểm thử)
- [x] **Cơ sở lập luận** — Đoạn "More agents/longer prompts are not the goal", vì sao ưu tiên bằng chứng
- [x] **quy trình áp dụng giải pháp** — [docs/EPDS.md](../../docs/EPDS.md) §0(định nghĩa) + §1~§5(quy trình xem xét công cụ, mẫu hình và cấu trúc)
- [x] **Cài đặt và Sử dụng** — Phần [Cài đặt](#cài-đặt) ở trên + [docs/INSTALL.md](docs/INSTALL.md)

Cách tôi đi đến đây (các công cụ đã xem, các mẫu hình đã loại bỏ, cơ sở lập luận) → [docs/EPDS.md](../../docs/EPDS.md)
