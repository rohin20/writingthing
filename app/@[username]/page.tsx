import { redirect } from "next/navigation";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  redirect(`/profile/${params.username}`);
} 