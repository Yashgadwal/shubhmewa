import React from "react";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/static-data";

export const revalidate = 0; // Dynamic server-side rendering

export default async function BlogListPage() {
  const posts = BLOG_POSTS.map((p) => ({
    ...p,
    category: { name: p.categoryName }
  }));

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Health & Wellness</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold mt-2">
            The Sourced Journal
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
          <p className="text-xs text-brand-muted mt-4 leading-relaxed">
            Read daily nutritional insights, proper storage practices, corporate gifting tips, and gourmet advice from our experts.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-sm text-brand-muted py-10">No journal posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border border-brand-cream-dark/30 rounded-3xl overflow-hidden hover:border-brand-gold shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] bg-brand-cream-light overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </Link>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-gold/10 text-brand-gold text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-md">
                        {post.category.name}
                      </span>
                      <span className="text-[10px] text-brand-muted">
                        {post.publishDate
                          ? new Date(post.publishDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2 className="font-serif-editorial text-xl md:text-2xl text-brand-green font-bold group-hover:text-brand-gold transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt extracted from post content */}
                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                      {post.content.replace(/[#*`_\[\]]/g, "").slice(0, 180).trim()}...
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-all"
                  >
                    <span>Read Article</span>
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
