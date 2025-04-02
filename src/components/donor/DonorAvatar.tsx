
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DonorAvatarProps {
  name: string;
  avatarUrl?: string;
}

export default function DonorAvatar({ name, avatarUrl }: DonorAvatarProps) {
  const initials = name.split(" ").map(part => part[0]).join("");
  
  return (
    <Avatar className="h-10 w-10 border border-border">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="bg-secondary text-secondary-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
