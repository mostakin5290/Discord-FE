import {
  UserPlus,
  ImagePlus,
  MessageCircle,
  Download,
  Gamepad2,
  ChevronRight,
  Sparkles,
} from "lucide-react";


interface ChecklistItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  completed?: boolean;
}

const WelcomeScreen = () => {
  const checklistItems: ChecklistItem[] = [
    {
      id: "invite",
      icon: <UserPlus className="w-5 h-5" />,
      title: "Invite your friends",
      completed: false,
    },
    {
      id: "customize",
      icon: <ImagePlus className="w-5 h-5" />,
      title: "Personalise your server with an icon",
      completed: false,
    },
    {
      id: "message",
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Send your first message",
      completed: false,
    },
    {
      id: "download",
      icon: <Download className="w-5 h-5" />,
      title: "Download the Discord App",
      completed: true,
    },
    {
      id: "app",
      icon: <Gamepad2 className="w-5 h-5" />,
      title: "Add your first app",
      completed: false,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-white p-8 animate-fade-in">
      <div className="max-w-xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5865f2] to-[#7289da] rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#23a559] rounded-full border-4 border-[#313338]" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Welcome to</h1>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#5865f2] to-[#7289da] bg-clip-text text-transparent">
            Your Server
          </h2>

          <p className="text-[#b5bac1] text-base leading-relaxed max-w-md mx-auto mt-4">
            This is your brand-new, shiny server. Here are some steps to help
            you get started. For more, check out our{" "}
            <span className="text-[#00a8fc] cursor-pointer hover:underline">
              Getting Started guide
            </span>
            .
          </p>
        </div>

        {/* Checklist Section */}
        <div className="space-y-2">
          {checklistItems.map((item, index) => (
            <button
              key={item.id}
              className="w-full group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 
                ${
                  item.completed
                    ? "bg-[#2b2d31] hover:bg-[#2e3035]"
                    : "bg-[#2b2d31] hover:bg-[#35373c] hover:shadow-lg hover:scale-[1.02]"
                }
                border border-transparent hover:border-[#404249]
                cursor-pointer group-active:scale-[0.98]`}
              >
                {/* Icon Container */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                  ${
                    item.completed
                      ? "bg-[#23a559] text-white"
                      : "bg-[#5865f2] text-white group-hover:bg-[#4752c4]"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <p
                    className={`font-medium transition-colors duration-200
                    ${
                      item.completed
                        ? "text-[#b5bac1]"
                        : "text-white group-hover:text-white"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>

                {/* Arrow or Checkmark */}
                {item.completed ? (
                  <div className="flex-shrink-0 w-8 h-8 bg-[#23a559] rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#80848e] group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#80848e] text-sm">
            Get started by creating your first server or joining one with an
            invite code!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
