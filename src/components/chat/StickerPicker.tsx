import { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";

interface Sticker {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

interface StickerPickerProps {
  onClose: () => void;
  onSelectSticker: (sticker: Sticker) => void;
}

const StickerPicker = ({ onClose, onSelectSticker }: StickerPickerProps) => {
  const [activeCategory, setActiveCategory] = useState("faces");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "faces", name: "Faces", emoji: "😀" },
    { id: "gestures", name: "Gestures", emoji: "👋" },
    { id: "activities", name: "Activities", emoji: "⚽" },
    { id: "objects", name: "Objects", emoji: "💎" },
    { id: "nature", name: "Nature", emoji: "🌸" },
    { id: "food", name: "Food", emoji: "🍕" },
  ];

  const stickers: Sticker[] = [
    // Faces
    { id: "happy", name: "Happy", emoji: "😊", category: "faces" },
    { id: "love", name: "Love", emoji: "😍", category: "faces" },
    { id: "cool", name: "Cool", emoji: "😎", category: "faces" },
    { id: "laugh", name: "Laugh", emoji: "😂", category: "faces" },
    { id: "sad", name: "Sad", emoji: "😢", category: "faces" },
    { id: "angry", name: "Angry", emoji: "😠", category: "faces" },
    { id: "surprised", name: "Surprised", emoji: "😲", category: "faces" },
    { id: "thinking", name: "Thinking", emoji: "🤔", category: "faces" },
    { id: "sleepy", name: "Sleepy", emoji: "😴", category: "faces" },

    // Gestures
    { id: "wave", name: "Wave", emoji: "👋", category: "gestures" },
    { id: "thumbsup", name: "Thumbs Up", emoji: "👍", category: "gestures" },
    { id: "clap", name: "Clap", emoji: "👏", category: "gestures" },
    { id: "pray", name: "Pray", emoji: "🙏", category: "gestures" },
    { id: "muscle", name: "Muscle", emoji: "💪", category: "gestures" },
    { id: "ok", name: "OK", emoji: "👌", category: "gestures" },
    { id: "peace", name: "Peace", emoji: "✌️", category: "gestures" },
    { id: "fist", name: "Fist Bump", emoji: "👊", category: "gestures" },

    // Activities
    { id: "soccer", name: "Soccer", emoji: "⚽", category: "activities" },
    {
      id: "basketball",
      name: "Basketball",
      emoji: "🏀",
      category: "activities",
    },
    { id: "music", name: "Music", emoji: "🎵", category: "activities" },
    { id: "game", name: "Game", emoji: "🎮", category: "activities" },
    { id: "trophy", name: "Trophy", emoji: "🏆", category: "activities" },
    { id: "party", name: "Party", emoji: "🎉", category: "activities" },
    { id: "art", name: "Art", emoji: "🎨", category: "activities" },
    { id: "movie", name: "Movie", emoji: "🎬", category: "activities" },

    // Objects
    { id: "diamond", name: "Diamond", emoji: "💎", category: "objects" },
    { id: "crown", name: "Crown", emoji: "👑", category: "objects" },
    { id: "fire", name: "Fire", emoji: "🔥", category: "objects" },
    { id: "star", name: "Star", emoji: "⭐", category: "objects" },
    { id: "sparkles", name: "Sparkles", emoji: "✨", category: "objects" },
    { id: "gift", name: "Gift", emoji: "🎁", category: "objects" },
    { id: "balloon", name: "Balloon", emoji: "🎈", category: "objects" },
    { id: "rocket", name: "Rocket", emoji: "🚀", category: "objects" },

    // Nature
    { id: "flower", name: "Flower", emoji: "🌸", category: "nature" },
    { id: "tree", name: "Tree", emoji: "🌲", category: "nature" },
    { id: "sun", name: "Sun", emoji: "☀️", category: "nature" },
    { id: "moon", name: "Moon", emoji: "🌙", category: "nature" },
    { id: "rainbow", name: "Rainbow", emoji: "🌈", category: "nature" },
    { id: "lightning", name: "Lightning", emoji: "⚡", category: "nature" },
    { id: "snowflake", name: "Snowflake", emoji: "❄️", category: "nature" },
    { id: "leaf", name: "Leaf", emoji: "🍃", category: "nature" },

    // Food
    { id: "pizza", name: "Pizza", emoji: "🍕", category: "food" },
    { id: "burger", name: "Burger", emoji: "🍔", category: "food" },
    { id: "cake", name: "Cake", emoji: "🎂", category: "food" },
    { id: "icecream", name: "Ice Cream", emoji: "🍦", category: "food" },
    { id: "coffee", name: "Coffee", emoji: "☕", category: "food" },
    { id: "donut", name: "Donut", emoji: "🍩", category: "food" },
    { id: "sushi", name: "Sushi", emoji: "🍣", category: "food" },
    { id: "fruit", name: "Fruit", emoji: "🍎", category: "food" },
  ];

  const filteredStickers = stickers.filter(
    (sticker) =>
      sticker.category === activeCategory &&
      (searchQuery === "" ||
        sticker.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="absolute bottom-16 right-0 w-[460px] bg-[#2b2d31] rounded-lg shadow-2xl border border-[#1e1f22] animate-in fade-in zoom-in-95 duration-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1e1f22] bg-gradient-to-r from-[#5865f2]/10 to-[#f0b232]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5865f2] to-[#f0b232] flex items-center justify-center animate-pulse">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Stickers</h3>
            <p className="text-[#b5bac1] text-xs mt-0.5">
              Express yourself with stickers
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#b5bac1] hover:text-white transition-all duration-200 p-1.5 hover:bg-[#35363c] rounded-md hover:scale-110 active:scale-95"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[#1e1f22]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d6f78]"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stickers..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#1e1f22] text-white text-sm rounded-lg border-none outline-none focus:ring-2 focus:ring-[#5865f2]/30 transition-all placeholder-[#6d6f78]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 p-3 border-b border-[#1e1f22] overflow-x-auto scrollbar-thin scrollbar-thumb-[#1a1b1e] scrollbar-track-transparent">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 min-w-[72px] ${
              activeCategory === category.id
                ? "bg-gradient-to-br from-[#5865f2] to-[#4752c4] scale-105 shadow-lg"
                : "bg-[#1e1f22] hover:bg-[#35363c] hover:scale-105"
            }`}
          >
            <span className="text-3xl">{category.emoji}</span>
            <span
              className={`text-xs font-bold ${
                activeCategory === category.id ? "text-white" : "text-[#b5bac1]"
              }`}
            >
              {category.name}
            </span>
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="p-4 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1a1b1e] scrollbar-track-transparent">
        {filteredStickers.length > 0 ? (
          <div className="grid grid-cols-6 gap-2">
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => onSelectSticker(sticker)}
                title={sticker.name}
                className="relative flex items-center justify-center p-3 bg-[#1e1f22] hover:bg-gradient-to-br hover:from-[#2b2d31] hover:to-[#35363c] rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 group overflow-hidden border-2 border-transparent hover:border-[#5865f2]/30"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-500" />

                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300 z-10">
                  {sticker.emoji}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[#6d6f78]">
            <Search size={56} className="mb-4 opacity-30" />
            <p className="text-sm font-medium">No stickers found</p>
            <p className="text-xs mt-1">Try a different search</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#1e1f22] bg-[#1e1f22]/50 backdrop-blur-sm">
        <p className="text-[#b5bac1] text-xs text-center">
          Click a sticker to send it instantly
        </p>
      </div>
    </div>
  );
};

export default StickerPicker;
