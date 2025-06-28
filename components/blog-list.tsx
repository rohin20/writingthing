"use client";
import Link from "next/link";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function BlogList({ blogs, profileUserId, username }: { blogs: any[]; profileUserId: string; username: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [blogList, setBlogList] = useState(blogs);
  useEffect(() => {
    const getUser = async () => {
      const supabase = createSupabaseClient();
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    getUser();
  }, []);

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const supabase = createSupabaseClient();
    await supabase.from("blogs").delete().eq("id", blogId);
    setBlogList((prev) => prev.filter((b) => b.id !== blogId));
  };

  return (
    <ul className="space-y-2">
      {blogList && blogList.length > 0 ? (
        blogList.map((blog) => {
          const date = blog.published_at ? new Date(blog.published_at) : null;
          const year = date ? date.getFullYear() : '';
          const month = date ? String(date.getMonth() + 1).padStart(2, '0') : '';
          const day = date ? String(date.getDate()).padStart(2, '0') : '';
          return (
            <li key={blog.id} className="flex gap-4 items-baseline text-[18px] font-sans">
              <span className="text-xs text-muted-foreground min-w-[100px] tabular-nums">
                {year && month && day ? `${year} · ${month} · ${day}` : ''}
              </span>
              <Link
                href={`/profile/${username}/${blog.slug}`}
                className="underline underline-offset-4 hover:opacity-80"
              >
                {blog.title}
              </Link>
              {userId === profileUserId && (
                <button
                  className="ml-4 text-xs text-flexokiRed hover:text-flexokiRed-light hover:underline"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              )}
            </li>
          );
        })
      ) : (
        <li className="text-muted-foreground">No blog posts yet.</li>
      )}
    </ul>
  );
} 