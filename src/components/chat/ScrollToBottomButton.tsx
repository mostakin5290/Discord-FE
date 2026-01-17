import { ArrowDown } from "lucide-react";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  newMessageCount?: number;
}

const ScrollToBottomButton = ({
  onClick,
  newMessageCount = 0,
}: ScrollToBottomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-8 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 z-30 animate-in zoom-in-50 slide-in-from-bottom-4 duration-300 group"
      title="Jump to latest message"
    >
      <div className="relative">
        <ArrowDown size={20} className="group-hover:animate-bounce" />
        {newMessageCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#da373c] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {newMessageCount > 9 ? "9+" : newMessageCount}
          </span>
        )}
      </div>
    </button>
  );
};

export { ScrollToBottomButton };
export default ScrollToBottomButton;
