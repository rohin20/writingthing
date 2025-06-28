import { UserAvatar } from "./user-avatar";

interface UserDisplayProps {
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  showAvatar?: boolean;
  className?: string;
}

export function UserDisplay({ 
  username, 
  fullName, 
  avatarUrl, 
  size = "md", 
  showAvatar = true,
  className = ""
}: UserDisplayProps) {
  const displayName = fullName || username;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && (
        <UserAvatar 
          username={username} 
          avatarUrl={avatarUrl} 
          fullName={fullName} 
          size={size} 
        />
      )}
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {displayName}
        </span>
        {fullName && (
          <span className="text-xs text-muted-foreground">
            @{username}
          </span>
        )}
      </div>
    </div>
  );
} 