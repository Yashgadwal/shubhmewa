import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS, DEFAULT_SETTINGS } from "@/lib/static-data";
import { ArrowLeft, Clock, User, Tag, ShoppingBag, MessageSquare, MapPin, Truck, ShieldCheck, Sparkles } from "lucide-react";

export const revalidate = 0; // Dynamic server-side rendering

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found | ShubhMewa" };

  return {
    title: `${post.title} | ShubhMewa Ujjain`,
    description: post.content.slice(0, 160).replace(/[#*`_\[\]]/g, "") + "...",
    keywords: post.tags,
    openGraph: {
      title: `${post.title} | ShubhMewa Ujjain`,
      description: post.content.slice(0, 160).replace(/[#*`_\[\]]/g, "") + "...",
      images: [post.featuredImage],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Resolve params promise in Next.js 15
  const { slug } = await params;

  // Find static blog post details
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);

  if (!staticPost) {
    notFound();
  }

  const post = {
    ...staticPost,
    category: { name: staticPost.categoryName }
  };

  const whatsappNumber = DEFAULT_SETTINGS["whatsapp_number"] || "8982010210";
  const storeAddress = DEFAULT_SETTINGS["store_address"] || "Shop No. 5, Gali No. 4, Tilak Marg, Dev Sahab Ki Gali, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh";

  // Filter recent posts
  const recentPosts = BLOG_POSTS.filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      category: { name: p.categoryName }
    }));

  // Rich Markdown Renderer
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];

    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-4 space-y-2 pl-4">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Heading 1 (# )
      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={idx} className="font-serif-editorial text-brand-green font-bold text-2xl md:text-3xl mt-10 mb-4 border-b border-brand-cream-dark/30 pb-2">
            {trimmed.replace("# ", "")}
          </h1>
        );
        return;
      }

      // Heading 2 (## )
      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={idx} className="font-serif-editorial text-brand-green font-bold text-xl md:text-2xl mt-10 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-brand-gold rounded-full shrink-0" />
            <span>{trimmed.replace("## ", "")}</span>
          </h2>
        );
        return;
      }

      // Heading 3 (### )
      if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={idx} className="font-serif-editorial text-brand-green font-bold text-lg md:text-xl mt-8 mb-3">
            {trimmed.replace("### ", "")}
          </h3>
        );
        return;
      }

      // Heading 4 (#### )
      if (trimmed.startsWith("#### ")) {
        flushList();
        elements.push(
          <h4 key={idx} className="font-serif-editorial text-brand-gold font-bold text-base md:text-lg mt-6 mb-2">
            {trimmed.replace("#### ", "")}
          </h4>
        );
        return;
      }

      // Images: ![alt](url)
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        flushList();
        elements.push(
          <div key={idx} className="my-8 rounded-2xl overflow-hidden border border-brand-cream-dark/30 shadow-xs bg-white">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto max-h-[420px] object-cover" />
            {imgMatch[1] && (
              <p className="text-center text-[11px] text-brand-muted italic py-2.5 bg-brand-cream-light/30 border-t border-brand-cream-dark/20">
                {imgMatch[1]}
              </p>
            )}
          </div>
        );
        return;
      }

      // Callout Box (> )
      if (trimmed.startsWith("> ")) {
        flushList();
        elements.push(
          <div key={idx} className="my-6 p-5 rounded-2xl bg-brand-cream-light/50 border-l-4 border-brand-gold text-xs md:text-sm text-brand-green leading-relaxed space-y-1">
            <p className="font-medium italic">{trimmed.replace(/^>\s*/, "")}</p>
          </div>
        );
        return;
      }

      // Unordered list items (- or *)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        inList = true;
        const text = trimmed.replace(/^[-*]\s+/, "");
        listItems.push(
          <li key={idx} className="text-xs md:text-sm text-brand-muted leading-relaxed flex items-start gap-2">
            <span className="text-brand-gold mt-1 shrink-0">•</span>
            <span>{text}</span>
          </li>
        );
        return;
      }

      // Ordered list items (1., 2., etc.)
      if (/^\d+\.\s+/.test(trimmed)) {
        inList = true;
        const text = trimmed.replace(/^\d+\.\s+/, "");
        const num = trimmed.match(/^(\d+)\./)?.[1] || "•";
        listItems.push(
          <li key={idx} className="text-xs md:text-sm text-brand-muted leading-relaxed flex items-start gap-2">
            <span className="font-bold text-brand-gold shrink-0">{num}.</span>
            <span>{text}</span>
          </li>
        );
        return;
      }

      // Empty line
      if (trimmed === "") {
        flushList();
        elements.push(<div key={idx} className="h-3" />);
        return;
      }

      // Standard paragraph
      flushList();
      elements.push(
        <p key={idx} className="text-xs md:text-sm text-brand-muted leading-relaxed my-3 text-justify">
          {trimmed}
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Article header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{post.category.name}</span>
          </div>

          <h1 className="font-serif-editorial text-3xl md:text-5xl text-brand-green font-bold leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-xs text-brand-muted border-y border-brand-cream-dark/30 py-3.5 font-semibold">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-gold" />
              <span>ShubhMewa Sourcing Team (Ujjain)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>
                {post.publishDate
                  ? new Date(post.publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "September 2026"}
              </span>
            </div>
            {post.tags && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-brand-gold" />
                <span className="capitalize">{post.tags.split(",").slice(0, 3).join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full aspect-[16/9] bg-brand-cream-light rounded-3xl overflow-hidden shadow-md border border-brand-cream-dark/30">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Local Ujjain Quick Order CTA Top Callout */}
        <div className="bg-gradient-to-r from-brand-green to-[#16433c] text-brand-cream-light p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Ujjain Local Express Delivery</span>
            </div>
            <p className="text-xs md:text-sm font-semibold text-brand-cream-light">
              Get fresh, hand-sorted dry fruits delivered to your doorstep in Ujjain today! Free delivery on orders above ₹399.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/shop"
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-cream-light px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Products</span>
            </Link>
          </div>
        </div>

        {/* Content body */}
        <article className="bg-white border border-brand-cream-dark/30 p-6 md:p-12 rounded-3xl shadow-xs leading-relaxed space-y-1">
          {renderContent(post.content)}
        </article>

        {/* Bottom Boutique Store Callout Card */}
        <div className="bg-white border border-brand-cream-dark/40 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-dark/20 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Quality & Freshness Guarantee</span>
              </div>
              <h3 className="font-serif-editorial text-2xl text-brand-green font-bold mt-1">
                Experience ShubhMewa Quality in Ujjain
              </h3>
            </div>
            <Link
              href="/shop"
              className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-brand-gold" />
              <span>Shop All Products</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-brand-cream-light/30 p-4 rounded-xl space-y-1 border border-brand-cream-dark/20">
              <span className="font-bold text-brand-green flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>Visit Store</span>
              </span>
              <p className="text-brand-muted text-[11px] leading-relaxed">
                {storeAddress}
              </p>
            </div>
            <div className="bg-brand-cream-light/30 p-4 rounded-xl space-y-1 border border-brand-cream-dark/20">
              <span className="font-bold text-brand-green flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-gold" />
                <span>Ujjain Delivery</span>
              </span>
              <p className="text-brand-muted text-[11px] leading-relaxed">
                Same-Day or 24-Hour Home Delivery across all Ujjain district pincodes. Free above ₹399.
              </p>
            </div>
            <div className="bg-brand-cream-light/30 p-4 rounded-xl space-y-1 border border-brand-cream-dark/20">
              <span className="font-bold text-brand-green flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span>Customer Guarantee</span>
              </span>
              <p className="text-brand-muted text-[11px] leading-relaxed">
                Full Refund & Instant Replacement available within 12 hours for damaged items.
              </p>
            </div>
          </div>
        </div>

        {/* Related Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="border-t border-brand-cream-dark/20 pt-10 space-y-6">
            <h3 className="font-serif-editorial text-2xl text-brand-green font-bold">
              More Nutrition & Buying Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group block space-y-2.5 bg-white p-4 rounded-2xl border border-brand-cream-dark/30 hover:border-brand-gold hover:shadow-md transition-all"
                >
                  <div className="aspect-[16/10] bg-brand-cream-light rounded-xl overflow-hidden border border-brand-cream-dark/20">
                    <img
                      src={rPost.featuredImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold block">
                    {rPost.category.name}
                  </span>
                  <h4 className="font-serif-editorial text-sm font-bold text-brand-green group-hover:text-brand-gold line-clamp-2 leading-snug">
                    {rPost.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
