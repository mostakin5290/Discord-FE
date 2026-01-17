import { cn } from "@/lib/utils";
import { getInitials, getStatusColor } from "@/utils/messageUtils";

interface UserAvatarProps {
  user: {
    username: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    status?: string;
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-2xl",
  xl: "w-20 h-20 text-4xl",
};

const statusSizeClasses = {
  xs: "w-2 h-2 border",
  sm: "w-3 h-3 border-2",
  md: "w-3 h-3 border-2",
  lg: "w-4 h-4 border-[3px]",
  xl: "w-6 h-6 border-4",
};

const UserAvatar = ({
  user,
  size = "md",
  showStatus = false,
  className,
  onClick,
}: UserAvatarProps) => {
  const sizeClass = sizeClasses[size];
  const statusSizeClass = statusSizeClasses[size];

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          "rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden",
          sizeClass,
          onClick && "cursor-pointer hover:opacity-90 transition-opacity",
          className,
        )}
        onClick={onClick}
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold">
            {getInitials(
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username,
            )}
          </span>
        )}
      </div>

      {showStatus && user.status && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-[#313338]",
            getStatusColor(user.status),
            statusSizeClass,
          )}
        />
      )}
    </div>
  );
};

export { UserAvatar };
export default UserAvatar;
