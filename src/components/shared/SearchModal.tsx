import { useState, useEffect } from "react";
import { X, Search, Hash, Loader2 } from "lucide-react";
import axiosClient from "@/lib/axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  content: string;
  createdAt: string;
  channelId: string;
  user: {
    id: string;
    username: string;
    imageUrl?: string;
  };
  channel: {
    id: string;
    name: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export const SearchModal = ({ isOpen, onClose, serverId }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus search input when modal opens
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const searchMessages = async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axiosClient.get(`/messages/search/${serverId}`, {
          params: { query },
        });
        setResults(response.data.results || []);
      } catch (error: any) {
        console.error("Search error:", error);
        toast.error(error?.response?.data?.message || "Failed to search messages");
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchMessages, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, serverId]);

  const handleResultClick = (result: SearchResult) => {
    navigate(`/server/${serverId}/${result.channelId}`);
    onClose();
    setQuery("");
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#313338] rounded-lg shadow-2xl animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-[#3e4046]">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-[#949ba4]" />
            <input
              id="search-input"
              type="text"
              placeholder="Search messages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-[#949ba4]"
            />
            {isSearching && <Loader2 size={20} className="text-[#5865f2] animate-spin" />}
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#3e4046] rounded transition-colors"
              aria-label="Close search"
            >
              <X size={20} className="text-[#b5bac1]" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-[#949ba4]">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-8 text-center text-[#949ba4]">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No messages found for "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 hover:bg-[#3e4046] transition-colors text-left flex items-start gap-3 group"
                >
                  {/* User Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    {result.user.imageUrl ? (
                      <img
                        src={result.user.imageUrl}
                        alt={result.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {result.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white font-medium text-sm">
                        {result.user.username}
                      </span>
                      <span className="text-xs text-[#949ba4]">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#dbdee1] text-sm line-clamp-2">
                      {result.content}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#949ba4]">
                      <Hash size={12} />
                      <span>{result.channel.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3e4046] flex items-center justify-between text-xs text-[#949ba4]">
          <span>
            {results.length > 0 && `${results.length} result${results.length !== 1 ? 's' : ''}`}
          </span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
