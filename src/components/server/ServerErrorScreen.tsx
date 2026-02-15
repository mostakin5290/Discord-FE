import { ServerCrash, UserX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface ServerErrorScreenProps {
  type: "not_found" | "not_member";
  serverId?: string;
}

const ServerErrorScreen = ({ type, serverId }: ServerErrorScreenProps) => {
  const navigate = useNavigate();

  const errorConfig = {
    not_found: {
      icon: <ServerCrash className="w-16 h-16" />,
      title: "Server Not Found",
      description: `The server${serverId ? ` "${serverId}"` : ""} doesn't exist or has been deleted.`,
      gradient: "from-red-500 to-orange-500",
      iconBg: "bg-red-500/20",
    },
    not_member: {
      icon: <UserX className="w-16 h-16" />,
      title: "Access Denied",
      description: `You are not a member of this server. Ask someone to invite you!`,
      gradient: "from-amber-500 to-yellow-500",
      iconBg: "bg-amber-500/20",
    },
  };

  const config = errorConfig[type];

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-white p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div
            className={`relative ${config.iconBg} p-6 rounded-full animate-pulse`}
          >
            <div
              className={`bg-gradient-to-br ${config.gradient} rounded-full p-4 text-white shadow-2xl`}
            >
              {config.icon}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl font-extrabold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
        >
          {config.title}
        </h1>

        {/* Description */}
        <p className="text-[#b5bac1] text-lg leading-relaxed">
          {config.description}
        </p>

        {/* Server ID Badge */}
        {serverId && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2b2d31] rounded-lg border border-[#404249]">
            <span className="text-[#80848e] text-sm">Server ID:</span>
            <code className="text-[#5865f2] font-mono text-sm">{serverId}</code>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help Text */}
        {type === "not_member" && (
          <p className="text-[#80848e] text-sm pt-4">
            If you believe this is an error, contact the server owner or ask for
            a new invite link.
          </p>
        )}
      </div>
    </div>
  );
};

export default ServerErrorScreen;

