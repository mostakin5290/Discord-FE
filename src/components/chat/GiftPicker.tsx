import { useState } from "react";
import { X, Gift as GiftIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Gift {
  id: string;
  name: string;
  icon: string;
  price: string;
  description: string;
}

interface GiftPickerProps {
  onClose: () => void;
  onSelectGift: (gift: Gift) => void;
}

const GiftPicker = ({ onClose, onSelectGift }: GiftPickerProps) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const gifts: Gift[] = [
    {
      id: "nitro",
      name: "Nitro",
      icon: "💎",
      price: "$9.99",
      description: "Give 1 month of Discord Nitro",
    },
    {
      id: "boost",
      name: "Server Boost",
      icon: "🚀",
      price: "$4.99",
      description: "Boost this server for 1 month",
    },
    {
      id: "cake",
      name: "Birthday Cake",
      icon: "🎂",
      price: "$2.99",
      description: "Celebrate with a delicious cake",
    },
    {
      id: "trophy",
      name: "Trophy",
      icon: "🏆",
      price: "$3.99",
      description: "Reward their achievement",
    },
    {
      id: "crown",
      name: "Crown",
      icon: "👑",
      price: "$5.99",
      description: "Make them feel like royalty",
    },
    {
      id: "fire",
      name: "Fire",
      icon: "🔥",
      price: "$1.99",
      description: "They're on fire!",
    },
    {
      id: "star",
      name: "Star",
      icon: "⭐",
      price: "$2.49",
      description: "You're a star!",
    },
    {
      id: "heart",
      name: "Heart",
      icon: "❤️",
      price: "$1.99",
      description: "Show some love",
    },
    {
      id: "party",
      name: "Party Popper",
      icon: "🎉",
      price: "$2.99",
      description: "Let's celebrate!",
    },
    {
      id: "gift",
      name: "Gift Box",
      icon: "🎁",
      price: "$3.49",
      description: "A mystery gift",
    },
    {
      id: "sparkles",
      name: "Sparkles",
      icon: "✨",
      price: "$2.99",
      description: "Add some magic",
    },
    {
      id: "balloon",
      name: "Balloon",
      icon: "🎈",
      price: "$1.99",
      description: "Float away with joy",
    },
  ];

  const handleGiftClick = (gift: Gift) => {
    setSelectedGift(gift);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedGift) {
      onSelectGift(selectedGift);
      setShowConfirm(false);
      onClose();
    }
  };

  return (
    <>
      <div className="absolute bottom-16 right-0 w-[420px] bg-[#2b2d31] rounded-lg shadow-2xl border border-[#1e1f22] animate-in fade-in zoom-in-95 duration-200 z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e1f22] bg-gradient-to-r from-[#5865f2]/10 to-[#23a559]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5865f2] to-[#23a559] flex items-center justify-center animate-pulse">
              <GiftIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                Send a Gift
                <Sparkles size={16} className="text-yellow-400" />
              </h3>
              <p className="text-[#b5bac1] text-xs mt-0.5">
                Make someone's day special
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

        {/* Gift Grid */}
        <div className="p-4 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1a1b1e] scrollbar-track-transparent">
          <div className="grid grid-cols-3 gap-3">
            {gifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleGiftClick(gift)}
                className="relative flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#1e1f22] to-[#2b2d31] hover:from-[#2b2d31] hover:to-[#35363c] rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-transparent hover:border-[#5865f2]/50 shadow-md hover:shadow-xl overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                <span className="text-5xl group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">
                  {gift.icon}
                </span>
                <div className="text-center z-10">
                  <p className="text-white text-sm font-bold group-hover:text-[#5865f2] transition-colors">
                    {gift.name}
                  </p>
                  <p className="text-[#23a559] text-xs font-bold mt-1 group-hover:scale-110 transition-transform">
                    {gift.price}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e1f22] bg-[#1e1f22]/50 backdrop-blur-sm">
          <p className="text-[#b5bac1] text-xs text-center leading-relaxed">
            🎁 Gifts can be sent to friends and server members
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && selectedGift && (
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="bg-[#313338] border-none text-white sm:max-w-[440px] p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-[#5865f2]/20 via-transparent to-[#23a559]/20 p-6">
              <DialogHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5865f2] to-[#23a559] flex items-center justify-center animate-pulse">
                      <span className="text-6xl">{selectedGift.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles size={16} className="text-yellow-900" />
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold text-center">
                  Send {selectedGift.name}?
                </DialogTitle>
                <p className="text-[#b5bac1] text-sm mt-2">
                  {selectedGift.description}
                </p>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#2b2d31] rounded-lg">
                <span className="text-[#b5bac1] text-sm">Price</span>
                <span className="text-[#23a559] text-xl font-bold">
                  {selectedGift.price}
                </span>
              </div>

              <div className="p-3 bg-[#f0b232]/10 border border-[#f0b232]/30 rounded-lg">
                <p className="text-[#dbdee1] text-xs text-center">
                  💡 This will send a gift message to the channel
                </p>
              </div>
            </div>

            <DialogFooter className="bg-[#2b2d31] px-6 py-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="text-white hover:underline hover:bg-transparent h-auto px-0"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="bg-gradient-to-r from-[#5865f2] to-[#4752c4] hover:from-[#4752c4] hover:to-[#3c45a5] text-white min-w-[120px] font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Send Gift 🎁
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GiftPicker;
