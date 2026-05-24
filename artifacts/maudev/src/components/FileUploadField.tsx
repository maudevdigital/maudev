import { useState, useRef } from "react";
import { Upload, X, FileCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/react";

interface FileUploadFieldProps {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  accept?: string;
}

export function FileUploadField({ label, value, onChange, accept }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setFileName(file.name);

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

      const { filePath, originalName } = await res.json();
      setFileName(originalName || file.name);
      onChange(filePath);
    } catch (err: any) {
      setError(err.message || "Error al subir archivo");
      setFileName(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange(null);
    setFileName(null);
    setError(null);
  };

  return (
    <div>
      <label className="text-xs font-mono text-muted-foreground block mb-1">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
      />

      {value ? (
        <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2">
          <FileCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-mono text-primary truncate flex-1">
            {fileName || "Archivo subido"}
          </span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-none font-mono text-xs gap-2 border-border/60 justify-start"
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
              SELECCIONAR ARCHIVO
            </>
          )}
        </Button>
      )}

      {error && (
        <p className="text-xs text-destructive font-mono mt-1">{error}</p>
      )}
    </div>
  );
}
