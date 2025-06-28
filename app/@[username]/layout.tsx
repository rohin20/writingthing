import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: ProfileLayoutProps) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, bio')
    .eq('username', params.username)
    .single();

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  const displayName = profile.full_name || profile.username;
  const title = `${displayName} - WritingThing`;
  const description = profile.bio || `Read blog posts by ${displayName} on WritingThing`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const supabase = await createClient();
  
  // Verify the profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', params.username)
    .single();

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 