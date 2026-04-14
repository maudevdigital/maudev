import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, Tag, User, ShoppingBag, X, ZoomIn, ZoomOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogPost, useListProducts } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import SEOHead from "@/components/seo-head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SITE_URL = "https://maudev.cl";

declare global {
  interface Window { adsbygoogle: any[]; }
}

function AdSlot({ slotId }: { slotId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or ad blocker
    }
    // Collapse if ad didn't fill after 3s
    const timer = setTimeout(() => {
      const ins = containerRef.current?.querySelector("ins");
      if (ins && ins.getAttribute("data-ad-status") === "unfilled") {
        containerRef.current!.style.display = "none";
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9062385247942411"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

function AdSlotAuto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or ad blocker
    }
    const timer = setTimeout(() => {
      const ins = containerRef.current?.querySelector("ins");
      if (ins && ins.getAttribute("data-ad-status") === "unfilled") {
        containerRef.current!.style.display = "none";
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-9062385247942411"
        data-ad-slot="4202340208"
      />
    </div>
  );
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z + (e.deltaY > 0 ? -0.25 : 0.25))));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, z + 0.25));
      if (e.key === "-") setZoom((z) => Math.max(1, z - 0.25));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPan((p) => ({ x: p.x + e.clientX - lastPos.current.x, y: p.y + e.clientY - lastPos.current.y }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handlePointerUp = () => { dragging.current = false; };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(4, z + 0.5)); }} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition-colors"><ZoomIn className="h-5 w-5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.5)); }} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition-colors"><ZoomOut className="h-5 w-5" /></button>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition-colors"><X className="h-5 w-5" /></button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono">{Math.round(zoom * 100)}% — Scroll para zoom, arrastra para mover</div>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, cursor: zoom > 1 ? "grab" : "zoom-in", transition: dragging.current ? "none" : "transform 0.2s" }}
        onClick={(e) => { e.stopPropagation(); if (zoom <= 1) setZoom(2); else { setZoom(1); setPan({ x: 0, y: 0 }); } }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        draggable={false}
      />
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGetBlogPost(slug || "", {
    query: { enabled: !!slug } as any,
  });
  const { isSignedIn } = useUser();
  const [lightboxSrc, setLightboxSrc] = useState<{ src: string; alt: string } | null>(null);

  const relatedProductIds: number[] = (post as any)?.relatedProductIds || [];
  const adsenseSlotId: string | null = (post as any)?.adsenseSlotId || null;
  const { data: allProducts } = useListProducts();
  const relatedProducts = allProducts?.filter((p: any) => relatedProductIds.includes(p.id)) || [];

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-16">
        <SEOHead title="Post No Encontrado" noindex />
        <div className="container max-w-screen-xl px-4 md:px-8 text-center">
          <p className="text-muted-foreground font-mono text-sm">POST NO ENCONTRADO</p>
          <Link href="/blog" className="text-primary font-mono text-xs mt-4 inline-block">
            VOLVER AL BLOG
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = (post as any).readingTimeMin || estimateReadingTime(post.content);
  const author = (post as any).author || "MauDev";
  const tags = (post as any).tags ? (post as any).tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
  const metaTitle = (post as any).metaTitle || post.title;
  const metaDescription = (post as any).metaDescription || post.excerpt;
  const metaKeywords = (post as any).metaKeywords || tags.join(", ");
  const canonicalUrl = (post as any).canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metaTitle,
    description: metaDescription,
    author: {
      "@type": "Organization",
      name: author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "MauDev",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    ...(post.imageUrl && { image: post.imageUrl }),
    ...(publishedDate && { datePublished: publishedDate.toISOString() }),
    ...(updatedDate && { dateModified: updatedDate.toISOString() }),
    ...(metaKeywords && { keywords: metaKeywords }),
    inLanguage: "es-CL",
    wordCount: post.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <article className="py-16" itemScope itemType="https://schema.org/Article">
      <SEOHead
        tabPrefix="📰"
        title={metaTitle}
        description={metaDescription}
        keywords={metaKeywords}
        canonical={canonicalUrl}
        ogType="article"
        ogImage={post.imageUrl || undefined}
        author={author}
        publishedTime={publishedDate?.toISOString()}
        modifiedTime={updatedDate?.toISOString()}
        jsonLd={articleJsonLd}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container max-w-screen-xl px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-mono text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" className="hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">Inicio</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/blog" className="hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-foreground truncate max-w-[200px]">
                <span itemProp="name">{post.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {post.imageUrl && (
            <figure className="mb-8">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover"
                itemProp="image"
                loading="eager"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </figure>
          )}

          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-mono text-muted-foreground">
              {publishedDate && (
                <time dateTime={publishedDate.toISOString()} className="flex items-center gap-1" itemProp="datePublished" content={publishedDate.toISOString()}>
                  <Calendar className="h-3 w-3" />
                  {publishedDate.toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min de lectura
              </span>
              <span className="flex items-center gap-1" itemProp="author" itemScope itemType="https://schema.org/Organization">
                <User className="h-3 w-3" />
                <span itemProp="name">{author}</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" itemProp="headline">{post.title}</h1>
            <p className="text-lg text-muted-foreground" itemProp="description">{post.excerpt}</p>

            {updatedDate && (
              <meta itemProp="dateModified" content={updatedDate.toISOString()} />
            )}
          </header>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">
                  <Tag className="h-2.5 w-2.5" />
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-border/40 pt-8">
            <div
              className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-primary prose-img:rounded-none prose-img:w-full prose-table:border-collapse prose-th:border prose-th:border-border/60 prose-th:px-3 prose-th:py-2 prose-th:bg-muted/30 prose-td:border prose-td:border-border/60 prose-td:px-3 prose-td:py-2"
              itemProp="articleBody"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt, ...props }) => {
                    // Resolve relative image paths to /images/blog/
                    const resolvedSrc = src && !src.startsWith("/") && !src.startsWith("http") ? `/images/blog/${src}` : src;
                    return (
                    <figure className="my-6">
                      <img
                        src={resolvedSrc}
                        alt={alt || ""}
                        className="w-full cursor-zoom-in hover:opacity-90 transition-opacity"
                        loading="lazy"
                        onClick={() => resolvedSrc && setLightboxSrc({ src: resolvedSrc, alt: alt || "" })}
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                          const fallback = el.nextElementSibling;
                          if (fallback) (fallback as HTMLElement).style.display = "flex";
                        }}
                        {...props}
                      />
                      <div className="hidden items-center justify-center h-48 border border-border/40 bg-muted/20 text-muted-foreground text-sm font-mono">
                        Imagen no disponible: {alt || src}
                      </div>
                      {alt && <figcaption className="text-center text-xs text-muted-foreground/60 mt-2 font-mono">{alt}</figcaption>}
                    </figure>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {lightboxSrc && <ImageLightbox src={lightboxSrc.src} alt={lightboxSrc.alt} onClose={() => setLightboxSrc(null)} />}

          {!isSignedIn && (adsenseSlotId ? <AdSlot slotId={adsenseSlotId} /> : <AdSlotAuto />)}

          {relatedProducts.length > 0 && (
            <div className="border-t border-border/40 mt-12 pt-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProducts.map((product: any) => {
                  const imgSrc = product.imageUrl || product.mediaUrls?.[0]?.url;
                  return (
                    <Link key={product.id} href={`/products/${product.id}`} className="block group border border-border/40 bg-card hover:border-primary/40 transition-colors">
                      {imgSrc && (
                        <img src={imgSrc} alt={product.name} className="w-full h-40 object-cover" />
                      )}
                      <div className="p-4">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                            <span className="text-xs text-muted-foreground line-through">${Number(product.originalPrice).toLocaleString("es-CL")}</span>
                          )}
                          <span className="text-sm font-mono text-primary">${Number(product.price).toLocaleString("es-CL")} CLP</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <footer className="border-t border-border/40 mt-12 pt-8">
            <div className="flex items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-mono">
                <ArrowLeft className="h-4 w-4" />
                VER MAS ARTICULOS
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}