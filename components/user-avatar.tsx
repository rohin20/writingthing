import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  fullName?: string | null;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ username, avatarUrl, fullName, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return username.slice(0, 2).toUpperCase();
  };

  // Generate a consistent color based on username
  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-flexokiBlue text-white',
      'bg-flexokiGreen text-white', 
      'bg-flexokiPurple text-white',
      'bg-flexokiCyan text-white',
      'bg-flexokiOrange text-white',
      'bg-flexokiMagenta text-white',
      'bg-flexokiRed text-white',
      'bg-flexokiYellow text-black'
    ];
    
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={fullName || username} />
      ) : null}
      <AvatarFallback className={getAvatarColor(username)}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
} 