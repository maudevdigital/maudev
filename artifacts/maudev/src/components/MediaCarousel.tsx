import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon, X, ZoomIn, ZoomOut } from "lucide-react";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface MediaCarouselProps {
  imageUrl?: string | null;
  mediaUrls?: MediaItem[];
  productName: string;
}

/* ─── Lightbox with zoom + pan ─── */
function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const clampTranslate = useCallback((x: number, y: number, s: number) => {
    if (s <= 1) return { x: 0, y: 0 };
    const maxX = ((s - 1) * window.innerWidth) / 2;
    const maxY = ((s - 1) * window.innerHeight) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  }, []);

  const zoomIn = () => {
    setScale((s) => {
      const next = Math.min(s + 0.5, 4);
      setTranslate((t) => clampTranslate(t.x, t.y, next));
      return next;
    });
  };
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1);
      setTranslate((t) => clampTranslate(t.x, t.y, next));
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTranslate(clampTranslate(translateStart.current.x + dx, translateStart.current.y + dy, scale));
  };
  const handlePointerUp = () => setDragging(false);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    setScale((s) => {
      const next = Math.max(1, Math.min(4, s + delta));
      setTranslate((t) => clampTranslate(t.x, t.y, next));
      return next;
    });
  }, [clampTranslate]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [handleWheel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button onClick={zoomOut} className="bg-black/70 border border-border/40 p-2 hover:border-primary/60 transition-colors" title="Alejar (-)">
          <ZoomOut className="h-5 w-5 text-primary" />
        </button>
        <button onClick={zoomIn} className="bg-black/70 border border-border/40 p-2 hover:border-primary/60 transition-colors" title="Acercar (+)">
          <ZoomIn className="h-5 w-5 text-primary" />
        </button>
        <button onClick={onClose} className="bg-black/70 border border-border/40 p-2 hover:border-primary/60 transition-colors" title="Cerrar (Esc)">
          <X className="h-5 w-5 text-primary" />
        </button>
      </div>

      {/* Zoom level */}
      <div className="absolute top-4 left-4 z-50 bg-black/70 border border-border/40 px-3 py-1">
        <span className="font-mono text-xs text-primary">{Math.round(scale * 100)}%</span>
      </div>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        style={{
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
          cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
          transition: dragging ? "none" : "transform 0.2s ease",
        }}
        onClick={(e) => {
          if (!dragging && scale === 1) zoomIn();
          e.stopPropagation();
        }}
      />
    </div>
  );
}

export function MediaCarousel({ imageUrl, mediaUrls = [], productName }: MediaCarouselProps) {
  const allMedia: MediaItem[] = [
    ...(imageUrl ? [{ url: imageUrl, type: "image" as const }] : []),
    ...mediaUrls,
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const goTo = (index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prev = () => goTo((current - 1 + allMedia.length) % allMedia.length);
  const next = () => goTo((current + 1) % allMedia.length);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [current]);

  const item = allMedia[current];
  const showControls = allMedia.length > 1;

  if (allMedia.length === 0) {
    return (
      <div className="relative">
        <div className="border border-border/40 overflow-hidden bg-black/20 relative aspect-[16/10] flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Main display */}
      <div className="border border-border/40 overflow-hidden bg-black/20 relative aspect-[16/10]">
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)" }} />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50 z-10" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 z-10" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 z-10" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50 z-10" />

        {/* Media content */}
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          {item.type === "video" ? (
            <video
              ref={videoRef}
              src={item.url}
              controls
              className="w-full h-full object-contain"
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={item.url}
              alt={`${productName} — ${current + 1}`}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />
          )}
        </div>

        {/* Counter badge */}
        {showControls && (
          <div className="absolute top-3 right-3 z-20 bg-black/70 border border-border/40 px-2 py-1">
            <span className="font-mono text-xs text-primary">
              {String(current + 1).padStart(2, "0")}
              <span className="text-muted-foreground"> / {String(allMedia.length).padStart(2, "0")}</span>
            </span>
          </div>
        )}

        {/* Nav arrows */}
        {showControls && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 border border-border/40 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:border-primary/60 hover:bg-black/80"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 border border-border/40 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:border-primary/60 hover:bg-black/80"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {showControls && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
          {allMedia.map((m, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative shrink-0 w-16 h-12 border overflow-hidden transition-all duration-200 ${
                i === current
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border/40 opacity-60 hover:opacity-100 hover:border-border/80"
              }`}
            >
              {m.type === "video" ? (
                <div className="w-full h-full bg-black/40 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary fill-primary/20" />
                </div>
              ) : (
                <img src={m.url} alt="" className="w-full h-full object-cover" />
              )}
              {/* Active indicator line */}
              {i === current && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && item?.type === "image" && (
        <ImageLightbox
          src={item.url}
          alt={`${productName} — ${current + 1}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
