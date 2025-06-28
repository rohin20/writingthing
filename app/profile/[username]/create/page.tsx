"use client";
import { useState, useRef } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface CreateBlogPageProps {
  params: Promise<{ username: string }>;
}

export default function CreateBlogPage({ params }: CreateBlogPageProps) {
  const { username } = React.use(params);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Slug generator (mimics DB function)
  function generateSlug(title: string) {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8)
    );
  }

  async function handlePublish() {
    const content = contentRef.current?.innerText || "";
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    const supabase = createClient();
    // Get user id from profile
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();
    if (profileError || !profile) {
      setLoading(false);
      alert("User not found");
      return;
    }
    const slug = generateSlug(title);
    const { error } = await supabase.from("blogs").insert({
      user_id: profile.id,
      title,
      slug,
      content,
      is_public: true,
      is_published: true,
      published_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) {
      alert("Failed to publish: " + error.message);
    } else {
      router.push(`/profile/${username}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-[18px]">
      <header className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <span className="font-medium text-[22px] tracking-tight">
            <Link href={`/profile/${username}`} className="hover:underline underline-offset-4">{username}</Link>
            <span className="text-muted-foreground">/create</span>
          </span>
          <nav className="flex gap-6 text-[16px] text-muted-foreground">
            <Link href={`/profile/${username}`} className="hover:underline underline-offset-4">Profile</Link>
            <button
              type="button"
              className="hover:underline underline-offset-4 text-inherit bg-transparent border-none p-0 m-0 font-inherit text-[16px] cursor-pointer"
              style={{ color: 'inherit' }}
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </nav>
        </div>
      </header>
      <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="New page"
          className="w-full text-5xl font-bold bg-transparent outline-none border-none placeholder:text-neutral-500 mb-2 focus:ring-0 focus:outline-none"
          style={{ boxShadow: "none" }}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className="w-full min-h-[200px] bg-transparent outline-none border-none text-[20px] placeholder:text-neutral-400 focus:ring-0 focus:outline-none prose prose-neutral max-w-none"
          style={{ boxShadow: "none", padding: 0, margin: 0 }}
          data-placeholder="Write, press 'space' for AI, '/' for commands..."
        />
      </form>
    </div>
  );
} 