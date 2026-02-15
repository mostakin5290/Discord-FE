import { useState, useEffect } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

interface AISummaryProps {
  channelId: string;
  channelName: string;
}

export const AISummary = ({ channelId, channelName }: AISummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check unread count on mount and channel change
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const response = await axiosClient.get(
          `/summary/channels/${channelId}/unread`
        );
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        setUnreadCount(0);
      }
    };
    
    // Initial check only
    checkUnread();
    
    // No interval - only check on mount/channel change
  }, [channelId]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/summary/channels/${channelId}/summary`
      );
      
      const summaryText = response.data.summary;
      const count = response.data.messageCount;
      
      setSummary(summaryText);
      setMessageCount(count);
      setUnreadCount(0);
      
      // Force modal open with slight delay
      setTimeout(() => {
        setIsOpen(true);
      }, 100);
      
    } catch (error: any) {
      console.error("❌ [FRONTEND] Summary fetch error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* Trigger Button with Badge - Only show if unread > 0 */}
      {unreadCount > 0 && (
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-[#2b2d31] hover:bg-[#1e1f22] text-[#dbdee1] rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-[#1e1f22] hover:border-[#5865f2]/30"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin text-[#5865f2]" />
          ) : (
            <Sparkles size={16} className="text-[#5865f2]" />
          )}
          <span className="hidden md:inline">
            {loading ? "Generating..." : "Catch Me Up"}
          </span>
          
          {/* Unread Badge */}
          {unreadCount > 0 && !loading && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Summary Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-[#2b2d31] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1e1f22]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Summary
                  </h3>
                  <p className="text-xs text-[#949ba4]">
                    #{channelName} • {messageCount} new messages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#949ba4] hover:text-white transition-colors p-1 hover:bg-[#1e1f22] rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {summary ? (
                <div className="space-y-4">
                  {/* Summary Text */}
                  <div className="bg-[#1e1f22] rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-[#dbdee1] leading-relaxed whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                  
                  {/* Message Count Badge */}
                  <div className="flex items-center gap-2 text-sm text-[#949ba4]">
                    <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                    <span>Summarized {messageCount} messages</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#949ba4]">
                  <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                  <p>Loading summary...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1e1f22] bg-[#1e1f22]">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-medium transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
