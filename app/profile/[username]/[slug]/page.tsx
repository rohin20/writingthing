import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface BlogPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const supabase = await createClient();

  // Get the profile by username
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .eq("username", params.username)
    .single();
  if (!profile) notFound();

  // Get the blog by slug and user_id
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, content, published_at")
    .eq("slug", params.slug)
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .eq("is_published", true)
    .single();
  if (!blog) notFound();

  const date = blog.published_at
    ? new Date(blog.published_at)
    : null;
  const dateString = date
    ? `${date.getFullYear()} · ${String(date.getMonth() + 1).padStart(2, "0")} · ${String(date.getDate()).padStart(2, "0")}`
    : "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-[18px] font-sans text-foreground">
      <header className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <span className="font-medium text-[22px] tracking-tight">
            <Link href={`/profile/${profile.username}`} className="hover:underline underline-offset-4">{profile.full_name || profile.username}</Link>
            <span className="text-muted-foreground">/{blog.title}</span>
          </span>
          <nav className="flex gap-6 text-[16px] text-muted-foreground">
            <Link href="/" className="hover:underline underline-offset-4">Home</Link>
            <Link href={`/profile/${profile.username}`} className="hover:underline underline-offset-4">Profile</Link>
          </nav>
        </div>
      </header>
      <article>
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <div className="text-xs text-muted-foreground mb-8 tabular-nums">{dateString}</div>
        <div className="prose prose-neutral max-w-none text-[20px] whitespace-pre-line">{blog.content}</div>
      </article>
    </div>
  );
} 