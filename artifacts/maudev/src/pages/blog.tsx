import { Link } from "wouter";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useListBlogPosts } from "@workspace/api-client-react";
import SEOHead from "@/components/seo-head";

const SITE_URL = "https://maudev.cl";

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog MauDev",
    description: "Art├¡culos sobre trading, indicadores Pine Script, herramientas MQL5, an├ílisis de mercado y desarrollo de software.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "MauDev",
      url: SITE_URL,
    },
    inLanguage: "es-CL",
    ...(posts && posts.length > 0 && {
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/blog/${post.slug}`,
        ...(post.publishedAt && { datePublished: post.publishedAt }),
        ...(post.imageUrl && { image: post.imageUrl }),
        author: { "@type": "Organization", name: (post as any).author || "MauDev" },
      })),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="py-16">
      <SEOHead
        title="Blog"
        description="Art├¡culos sobre trading, indicadores Pine Script, herramientas MQL5, an├ílisis de mercado y desarrollo de software. Aprende estrategias y t├®cnicas de los expertos."
        keywords="trading, pine script, indicadores, mql5, metatrader, an├ílisis de mercado, desarrollo web, blog trading chile"
        canonical={`${SITE_URL}/blog`}
        jsonLd={blogJsonLd}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container max-w-screen-xl px-4 md:px-8">
        <header className="max-w-3xl mx-auto mb-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Inicio</Link></li>
              <li>/</li>
              <li className="text-foreground">Blog</li>
            </ol>
          </nav>
          <p className="font-mono text-xs text-primary mb-2">BLOG</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Articulos & Actualizaciones</h1>
          <p className="text-muted-foreground">
            Trading, desarrollo de software, herramientas y analisis de mercado.
          </p>
        </header>

        {isLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border/40 bg-card p-6">
                <Skeleton className="h-5 w-2/3 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center py-16">
            <p className="text-muted-foreground font-mono text-sm">PROXIMAMENTE</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Estamos preparando contenido para ti.</p>
          </div>
        ) : (
          <section className="max-w-3xl mx-auto space-y-6">
            {posts.map((post) => {
              const readingTime = (post as any).readingTimeMin || estimateReadingTime(post.content);
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="border border-border/40 bg-card hover:border-primary/30 transition-colors cursor-pointer group" itemScope itemType="https://schema.org/BlogPosting">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        itemProp="image"
                        loading="lazy"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-muted-foreground">
                        {post.publishedAt && (
                          <time
                            dateTime={post.publishedAt}
                            className="flex items-center gap-1 font-mono text-[10px]"
                            itemProp="datePublished"
                            content={post.publishedAt}
                          >
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
                          </time>
                        )}
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Clock className="h-3 w-3" />
                          {readingTime} min
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors" itemProp="headline">{post.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2" itemProp="description">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-primary font-mono text-xs">
                        LEER MAS <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}