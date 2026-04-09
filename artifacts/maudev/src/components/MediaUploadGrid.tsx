import { useState, useRef } from "react";
import { Upload, X, Play, Image as ImageIcon, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/react";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface MediaUploadGridProps {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const VIDEO_EXTS = [".mp4", ".webm", ".mov"];
const ACCEPT = [...IMAGE_EXTS, ...VIDEO_EXTS].join(",");

function getMediaType(filename: string): "image" | "video" {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  return VIDEO_EXTS.includes(ext) ? "video" : "image";
}

export function MediaUploadGrid({ value, onChange }: MediaUploadGridProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newItems: MediaItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const token = await getToken();
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/uploads/file", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Error ${res.status}`);
        }
        const { filePath } = await res.json();
        newItems.push({ url: filePath, type: getMediaType(file.name) });
      } catch (err: any) {
        setError(err.message || "Error al subir archivo");
      }
    }

    if (newItems.length > 0) {
      onChange([...value, ...newItems]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDragIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;
    const reordered = [...value];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    setDragIdx(index);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  return (
    <div>
      <label className="text-xs font-mono text-muted-foreground block mb-2">
        GALERÍA DE MEDIA <span className="text-muted-foreground/50">— imágenes y videos</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {/* Grid of uploaded media */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {value.map((item, i) => (
            <div
              key={`${item.url}-${i}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-video border overflow-hidden group cursor-grab active:cursor-grabbing transition-all ${
                dragIdx === i
                  ? "border-primary ring-1 ring-primary/30 opacity-50"
                  : "border-border/40 hover:border-primary/40"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-black/40 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary fill-primary/20" />
                  <span className="absolute bottom-1 left-1 font-mono text-[10px] text-muted-foreground bg-black/50 px-1">
                    VIDEO
                  </span>
                </div>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}

              {/* Drag handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3 w-3 text-white drop-shadow" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="absolute top-1 right-1 bg-black/70 border border-border/40 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:border-destructive/60"
              >
                <X className="h-3 w-3 text-destructive" />
              </button>

              {/* Index badge */}
              <div className="absolute bottom-1 right-1 bg-black/70 px-1">
                <span className="font-mono text-[10px] text-primary">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-none font-mono text-xs gap-2 border-dashed border-border/60 justify-center hover:border-primary/60 hover:bg-primary/5 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            SUBIENDO...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            AÑADIR IMÁGENES / VIDEOS
          </>
        )}
      </Button>

      {error && <p className="text-xs text-destructive font-mono mt-1">{error}</p>}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground/60 font-mono mt-1">
          {value.length} archivo{value.length !== 1 ? "s" : ""} — arrastra para reordenar
        </p>
      )}
    </div>
  );
}
