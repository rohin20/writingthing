import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { UserDisplay } from "./user-display";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/profile/${profile?.username || 'profile'}`}>
          <UserDisplay
            username={profile?.username || 'user'}
            fullName={profile?.full_name}
            avatarUrl={profile?.avatar_url}
            size="sm"
            showAvatar={true}
          />
        </Link>
      </Button>
      <LogoutButton />
    </div>
  );
}
