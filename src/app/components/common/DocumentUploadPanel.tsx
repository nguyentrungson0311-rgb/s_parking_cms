import * as React from "react";
import { useCommonDrawerOverlay } from "@/app/components/common/CommonDrawer";
import { LoadingOverlay } from "@/app/components/common/LoadingOverlay";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Download,
  File,
  FileSpreadsheet,
  Grid2X2,
  Image as ImageIcon,
  List,
  RefreshCcw,
  Trash2,
  UploadCloud,
} from "lucide-react";

type DocumentViewMode = "grid" | "list";

export type UploadedDocument = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  type?: string;
  url?: string;
};

const acceptTypes = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
  ".xlsx",
].join(",");

const maxFileSize = 5 * 1024 * 1024;

const initialDocuments: UploadedDocument[] = [
  {
    id: "doc-template",
    name: "DanhSachNhanSu_Template.xlsx",
    size: 16 * 1024,
    uploadedAt: "15/07/2026 11:05",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    id: "doc-moduleblue",
    name: "moduleblue.png",
    size: 3.76 * 1024 * 1024,
    uploadedAt: "15/07/2026 11:05",
    type: "image/png",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatUploadTime(date = new Date()) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDocumentIcon(document: UploadedDocument) {
  if (document.type?.startsWith("image/")) return ImageIcon;
  if (document.name.toLowerCase().endsWith(".xlsx")) return FileSpreadsheet;
  return File;
}

function isImage(document: UploadedDocument) {
  return document.type?.startsWith("image/") && Boolean(document.url);
}

export function DocumentUploadPanel({
  title = "Tài liệu liên quan đến thẻ/vé",
}: {
  title?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlsRef = React.useRef<string[]>([]);
  const [documents, setDocuments] = React.useState<UploadedDocument[]>(initialDocuments);
  const [viewMode, setViewMode] = React.useState<DocumentViewMode>("grid");
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const loadingOverlay = React.useMemo(
    () => (uploading ? <LoadingOverlay /> : null),
    [uploading],
  );
  const hasDrawerOverlay = useCommonDrawerOverlay(loadingOverlay);

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const uploadFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((file) => file.size <= maxFileSize);
    if (files.length === 0) return;

    setUploading(true);
    window.setTimeout(() => {
      const nextDocuments = files.map((file) => {
        const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
        if (url) objectUrlsRef.current.push(url);

        return {
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
          name: file.name,
          size: file.size,
          uploadedAt: formatUploadTime(),
          type: file.type,
          url,
        };
      });

      setDocuments((current) => [...current, ...nextDocuments]);
      setUploading(false);
    }, 850);
  };

  const removeDocument = (id: string) => {
    setDocuments((current) => {
      const target = current.find((document) => document.id === id);
      if (target?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
        objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== target.url);
      }
      return current.filter((document) => document.id !== id);
    });
  };

  const downloadDocument = (document: UploadedDocument) => {
    if (!document.url) return;

    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  return (
    <Card className="sp-card relative p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-strong">{title}</h3>
       
          <ViewToggle value={viewMode} onChange={setViewMode} />
        
      </div>

      <div
        className={cn(
          "rounded-lg border border-dashed border-border bg-surface p-5 transition-colors",
          dragActive && "border-theme bg-theme-soft",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          uploadFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          multiple
          accept={acceptTypes}
          onChange={(event) => {
            if (event.target.files) uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="min-h-10 w-full flex-wrap justify-center gap-1 rounded-md px-2 text-base font-medium text-muted hover:bg-badge-neutral-bg hover:text-muted"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="size-5 text-theme" />
          Kéo thả file vào đây hoặc
          <span className="font-bold text-theme">chọn file</span>
          <span className="text-muted">· PDF, JPG, PNG, DOC, DOCX, XLSX (Tối đa 5MB)</span>
        </Button>

        {documents.length > 0 ? (
          viewMode === "grid" ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {documents.map((document) => (
                <DocumentThumb
                  key={document.id}
                  document={document}
                  onDownload={() => downloadDocument(document)}
                  onRemove={() => removeDocument(document.id)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 divide-y divide-border overflow-hidden rounded-md border border-border">
              {documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  onDownload={() => downloadDocument(document)}
                  onRemove={() => removeDocument(document.id)}
                />
              ))}
            </div>
          )
        ) : null}
      </div>

      {uploading && !hasDrawerOverlay ? loadingOverlay : null}
    </Card>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: DocumentViewMode;
  onChange: (value: DocumentViewMode) => void;
}) {
  return (
    <div className="flex items-center rounded-md bg-surface p-1">
      <Button
        type="button"
        variant={value === "grid" ? "secondary" : "ghost"}
        size="icon-sm"
        className={cn(
          "rounded-[6px]",
          value === "grid" ? "text-theme" : "text-muted",
        )}
        onClick={() => onChange("grid")}
        aria-label="Xem dạng thumbnail"
      >
        <Grid2X2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "secondary" : "ghost"}
        size="icon-sm"
        className={cn(
          "rounded-[6px]",
          value === "list" ? "text-theme" : "text-muted",
        )}
        onClick={() => onChange("list")}
        aria-label="Xem dạng danh sách"
      >
        <List className="size-4" />
      </Button>
    </div>
  );
}

function DocumentThumb({
  document,
  onDownload,
  onRemove,
}: {
  document: UploadedDocument;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const Icon = getDocumentIcon(document);

  return (
    <article className="group overflow-hidden rounded-md border border-border bg-surface">
      <div className="relative h-32 bg-badge-neutral-bg">
        {isImage(document) ? (
          <img src={document.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-theme">
            <Icon className="size-10" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <IconButton label="Tải xuống" onClick={onDownload} disabled={!document.url}>
            <Download className="size-4" />
          </IconButton>
          <IconButton label="Xóa" onClick={onRemove} tone="danger">
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>
      <div className="p-3">
        <div className="truncate text-base font-bold text-strong">{document.name}</div>
        <div className="mt-1 text-sm text-muted">
          {document.uploadedAt} · {formatBytes(document.size)}
        </div>
      </div>
    </article>
  );
}

function DocumentRow({
  document,
  onDownload,
  onRemove,
}: {
  document: UploadedDocument;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const Icon = getDocumentIcon(document);

  return (
    <article className="flex min-h-[68px] items-center gap-3 bg-surface px-4 py-3">
      <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md bg-theme-soft text-theme">
        {isImage(document) ? (
          <img src={document.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className="size-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold text-strong">{document.name}</div>
        <div className="text-sm text-muted">
          {document.uploadedAt} · {formatBytes(document.size)}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton label="Tải xuống" onClick={onDownload} disabled={!document.url}>
          <Download className="size-4" />
        </IconButton>
        <IconButton label="Xóa" onClick={onRemove} tone="danger">
          <Trash2 className="size-4" />
        </IconButton>
      </div>
    </article>
  );
}

function IconButton({
  label,
  children,
  onClick,
  disabled,
  tone = "default",
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <Button
      type="button"
      disabled={disabled}
      variant="outline-plain"
      size="icon-sm"
      className={cn(
        "rounded-md bg-surface text-muted shadow-sm hover:bg-theme-soft hover:text-theme disabled:opacity-40",
        tone === "danger" && "hover:bg-[#FDECEC] hover:text-destructive",
      )}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}

