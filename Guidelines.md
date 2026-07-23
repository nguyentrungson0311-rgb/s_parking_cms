# S-Parking CMS Guidelines

- Layout dùng flex/grid responsive, không fix canvas theo kích thước export từ Pencil.
- Sidebar width dùng token chung `--sp-sidebar-width`; không chỉnh riêng `w-*` trên Sidebar nếu muốn main body tự giãn đúng.
- Page con phải có breadcrumb khi có ngữ cảnh điều hướng.
- Spacing không dùng quá lớn; ưu tiên `gap-4`, `p-4`, `pt-4`, `space-y-4`, `mb-4`. Chỉ dùng spacing lớn hơn khi layout thật sự cần.
- Input có label và field dùng `space-y-2`.
- Page có table data tham khảo `MonthlyVehicleTable.tsx`: sticky header, search, filter, advanced filter, pagination.
- Các mục select dùng `select.tsx`, không dùng select mặc định của browser.
- Sử dụng icon dạng fill hoặc icon component rõ ràng, không dùng emoji.
- Ưu tiên class Tailwind và token theme, tránh inline style.

## Complex Table Layout

- Màn dạng table/detail phức tạp phải dùng `src/app/components/common/ComplexTableCard.tsx`.
- Không tự dựng lại `Card + header + aside + tabs + table header` trong page.
- Header ngoài của màn đặt ở `ComplexTableCard`: back button, title, description tùy chọn, action chính.
- Aside truyền qua prop `aside`; có màn không cần aside thì bỏ prop này.
- Tabs truyền qua prop `tabs` để tab nằm chung layout và ăn theo bảng bên dưới.
- Search/more action theo từng tab/bảng đặt trong `tableHeader`; không đặt lẫn với action chính ở header ngoài.
- Với màn detail có nhiều bảng, gom toàn bộ bảng của màn đó vào một file `...Tables.tsx` ; không tách mỗi bảng thành một file riêng nếu chỉ phục vụ một màn.
- Page component top-level chỉ điều phối state/layout. Không đặt implementation `DataTable`/table rows trực tiếp trong page.

## Data / Component Separation

- Table component phải là presentational component: nhận `rows` qua props, không import mock data từ `src/app/data`.
- Không đặt default props kiểu `rows = mockRows` trong table component. Page/container phải truyền `rows` rõ ràng.
- Page/container là nơi import data mock/API, giữ state, filter, selection ngữ cảnh, và truyền callbacks xuống table/detail.
- File data trong `src/app/data` chỉ chứa mock data/config thuần; không chứa JSX, hook, icon component, hoặc UI handler.
- Detail page dùng `ComplexTableCard` để compose layout và điều phối state. Section UI chỉ tách ra `src/app/components` khi thật sự dùng lại ở nhiều màn.
- Các config dùng chung như section map, initial slot rows, profit summary cards đặt trong file data/config riêng, không để inline trong page.
- Khi tạo table/detail mới, kiểm tra nhanh:
  - Table có import từ `src/app/data` không? Nếu có thì sai.
  - Page có đang dài vì chưa tách section UI không? Nếu có thì tách component.
  - Mock data/config có nằm trong page/component UI không? Nếu có thì chuyển sang `src/app/data`.

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
