interface Activity {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  activityType: "playing" | "listening" | "watching" | "streaming";
  activityName: string;
  details?: string;
}

const ActiveNow = () => {
  // Mock data - replace with actual active friends data
  const activities: Activity[] = [];

  return (
    <div className="w-90 bg-[#2b2d31] flex flex-col border-l border-[#1e1f22]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1f22]">
        <h3 className="text-xl font-bold text-white">Active Now</h3>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {activities.length === 0 ? (
          <>
            <div className="mb-4">
              <div className="w-46 h-31 mx-auto mb-4">
                {/* Illustration placeholder */}
                <svg
                  viewBox="0 0 184 124"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.6">
                    <circle cx="92" cy="62" r="40" fill="#3f4147" />
                    <path
                      d="M92 42C92 42 72 52 72 72C72 92 92 102 92 102C92 102 112 92 112 72C112 52 92 42 92 42Z"
                      fill="#5865f2"
                      opacity="0.4"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              It's quiet for now...
            </h4>
            <p className="text-sm text-[#949ba4] leading-relaxed max-w-xs">
              When a friend starts an activity — like playing a game or hanging
              out on voice — we'll show it here!
            </p>
          </>
        ) : (
          <div className="w-full space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-[#232428] rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0">
                  {activity.avatar ? (
                    <img
                      src={activity.avatar}
                      alt={activity.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {activity.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">
                    {activity.username}
                  </div>
                  <div className="text-xs text-[#949ba4] mt-1">
                    <div className="font-semibold">{activity.activityName}</div>
                    {activity.details && (
                      <div className="mt-0.5">{activity.details}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveNow;
