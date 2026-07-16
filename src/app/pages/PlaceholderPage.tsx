import { Topbar } from "@/app/components/layout/Topbar";
import { Card } from "@/app/components/ui/card";

export function PlaceholderPage({
  title,
  parent,
}: {
  title: string;
  parent: string;
}) {
  return (
    <div className="sp-page">
      <Topbar title={parent} breadcrumbs={["Home page", parent, title]} />
      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          <Card className="grid h-full min-h-0 w-full place-items-center p-8 text-center">
          <div>
            <div className="text-lg font-semibold text-[var(--sp-strong)]">{title}</div>
            <p className="mt-2 text-base text-[var(--sp-muted)]">
              Nội dung đang được cấu hình.
            </p>
          </div>
        </Card>
        </section>
      </div>
    </div>
  );
}
