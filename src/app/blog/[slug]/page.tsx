import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/static-data";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";

export const revalidate = 0; // Dynamic server-side rendering

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
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

  // Filter recent posts
  const recentPosts = BLOG_POSTS.filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      category: { name: p.categoryName }
    }));

  // Zero-dependency simple Markdown-to-React elements parser
  const renderContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="font-serif-editorial text-brand-green font-bold text-xl md:text-2xl mt-8 mb-4">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("#### ")) {
        return (
          <h4 key={idx} className="font-serif-editorial text-brand-green font-bold text-lg md:text-xl mt-6 mb-3">
            {trimmed.replace("#### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("1. ")) {
        return (
          <li key={idx} className="list-decimal list-inside ml-4 text-xs text-brand-muted my-2 pl-2">
            {trimmed.replace(/^\d+\.\s+/, "")}
          </li>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={idx} className="list-disc list-inside ml-4 text-xs text-brand-muted my-2 pl-2">
            {trimmed.replace(/^[-*]\s+/, "")}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-4" />;
      }
      return (
        <p key={idx} className="text-xs md:text-sm text-brand-muted leading-relaxed my-3">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
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
          <span className="bg-brand-gold/10 text-brand-gold text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-md w-fit block">
            {post.category.name}
          </span>
          <h1 className="font-serif-editorial text-3xl md:text-5xl text-brand-green font-bold leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-xs text-brand-muted border-y border-brand-cream-dark/30 py-3 font-semibold">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-brand-gold" />
              <span>ShubhMewa Curator</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>
                {post.publishDate
                  ? new Date(post.publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            {post.tags && (
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4 text-brand-gold" />
                <span className="capitalize">{post.tags.split(",").join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full aspect-[16/9] bg-brand-cream-light rounded-3xl overflow-hidden shadow-sm border border-brand-cream-dark/30">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content body */}
        <article className="prose prose-sm max-w-none text-brand-muted leading-relaxed">
          {renderContent(post.content)}
        </article>

        {/* Sourcing footer box */}
        <div className="bg-white border border-brand-cream-dark/40 p-6 rounded-2xl flex items-center justify-between mt-12 gap-4">
          <div>
            <h4 className="font-serif-editorial text-brand-green font-bold text-base">
              Need Premium Gifting?
            </h4>
            <p className="text-xs text-brand-muted mt-1 max-w-sm">
              We design custom gift boxes for family celebrations and corporate events. Sourced and packed fresh in Ujjain.
            </p>
          </div>
          <Link
            href="/gifting"
            className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
          >
            Proposal Request
          </Link>
        </div>

        {/* Related Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="border-t border-brand-cream-dark/20 pt-12 space-y-6">
            <h3 className="font-serif-editorial text-2xl text-brand-green font-bold">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group block space-y-2"
                >
                  <div className="aspect-[16/10] bg-brand-cream-light rounded-xl overflow-hidden border border-brand-cream-dark/30">
                    <img
                      src={rPost.featuredImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
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
