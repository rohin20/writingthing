import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlogList from "@/components/blog-list";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();
  
  // Get the profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Get the user's public blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, published_at')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-[18px] font-sans text-foreground">
      {/* Minimal Header */}
      <header className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <span className="font-medium text-[22px] tracking-tight">
            {profile.full_name || profile.username}
          </span>
          <nav className="flex gap-6 text-[16px] text-muted-foreground">
            <Link href="/" className="hover:underline underline-offset-4">Home</Link>
            <Link href={`/profile/${profile.username}/create`} className="hover:underline underline-offset-4">Create</Link>
          </nav>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          @{profile.username}
        </div>
        {profile.bio && (
          <div className="text-[18px] text-muted-foreground mb-4" style={{ maxWidth: 480 }}>
            {profile.bio}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Joined {new Date(profile.created_at).toLocaleDateString()}
          {profile.website && (
            <>
              {" · "}
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
              >
                Website
              </a>
            </>
          )}
        </div>
      </header>

      {/* Latest Blog */}
      {blogs && blogs.length > 0 && (
        <section className="mb-12 font-sans">
          <div className="text-sm text-muted-foreground mb-1">Latest</div>
          <div className="mb-2">
            <Link
              href={`/profile/${username}/${blogs[0].slug}`}
              className="font-semibold text-[22px] hover:underline underline-offset-4"
            >
              {blogs[0].title}
            </Link>
          </div>
          <div className="text-xs text-muted-foreground mb-2 tabular-nums">
            {blogs[0].published_at ? new Date(blogs[0].published_at).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, ' · ') : null}
          </div>
          {blogs[0].excerpt && (
            <div className="text-[18px] text-muted-foreground mb-2 max-w-xl">
              {blogs[0].excerpt}
            </div>
          )}
          <Link
            href={`/profile/${username}/${blogs[0].slug}`}
            className="text-[16px] hover:underline underline-offset-4"
          >
            Keep reading →
          </Link>
        </section>
      )}

      {/* Blog List */}
      <section className="font-sans">
        <div className="text-[16px] text-muted-foreground mb-2">Writing</div>
        <BlogList blogs={blogs ?? []} profileUserId={profile.id} username={username} />
      </section>
    </div>
  );
} 