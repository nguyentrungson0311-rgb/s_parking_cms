# S-Parking CMS Guidelines

- Layout dùng flex/grid responsive, không fix canvas theo kích thước export từ Pencil.
- Sidebar width dùng token chung `--sp-sidebar-width`; không chỉnh riêng `w-*` trên Sidebar nếu muốn main body tự giãn đúng.
- Page con phải có breadcrumb khi có ngữ cảnh điều hướng.
- Spacing không dùng quá lớn; ưu tiên `gap-3`, `p-3`, `pt-3`, `space-y-3`, `mb-3`. Chỉ dùng spacing lớn hơn khi layout thật sự cần.
- Input có label và field dùng `space-y-2`.
- Page có table data tham khảo `EmployeeList.tsx` / `CommonTable.tsx`: sticky header, search, filter, advanced filter, pagination.
- Các mục select dùng `select.tsx`, không dùng select mặc định của browser.
- Sử dụng icon dạng fill hoặc icon component rõ ràng, không dùng emoji.
- Ưu tiên class Tailwind và token theme, tránh inline style.

## Typography

- Font chính: Inter + SF Pro fallback.
- Không hardcode font size dạng `text-[...]`.
- Chỉ dùng scale text chung:
  - `text-xs`: 10px
  - `text-sm`: 12px
  - `text-md`: 14px
  - `text-base`: 16px
  - `text-lg`: 18px
  - `text-xl`: 24px
  - `text-2xl`: 36px
- Nếu cần cỡ mới, bổ sung vào token trước rồi mới sử dụng trong component.
