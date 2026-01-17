interface TypingIndicatorProps {
  usernames: string[];
}

const TypingIndicator = ({ usernames }: TypingIndicatorProps) => {
  if (usernames.length === 0) return null;

  const displayText =
    usernames.length === 1
      ? `${usernames[0]} is typing...`
      : usernames.length === 2
        ? `${usernames[0]} and ${usernames[1]} are typing...`
        : `${usernames[0]} and ${usernames.length - 1} others are typing...`;

  return (
    <div className="px-4 py-2 text-sm text-[#949ba4] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#5865f2] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-[#5865f2] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-[#5865f2] rounded-full animate-bounce" />
        </div>
        <span className="font-medium">{displayText}</span>
      </div>
    </div>
  );
};

export { TypingIndicator };
export default TypingIndicator;
