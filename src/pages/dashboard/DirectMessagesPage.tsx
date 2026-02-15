import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/types";
import DMSidebar from "@/components/dashboard/DMSidebar";
import FriendsPanel from "@/components/dashboard/FriendsPanel";
import ActiveNow from "@/components/dashboard/ActiveNow";
import DirectMessageChat from "@/components/dashboard/DirectMessageChat";
import UserProfileSidebar from "@/components/dashboard/UserProfileSidebar";

const DirectMessagesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  // const { servers } = useSelector((state: RootState) => state.server); // Handled by Layout
  const [selectedView, setSelectedView] = useState<"friends" | "dm">("friends");
  const [selectedDMUserId, setSelectedDMUserId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(true);

  // Server fetching logic moved to Layout

  useEffect(() => {
    if (userId) {
      setSelectedView("dm");
      setSelectedDMUserId(userId);
    } else {
      setSelectedView("friends");
      setSelectedDMUserId(null);
    }
  }, [userId]);

  const handleSelectFriends = () => {
    setSelectedView("friends");
    setSelectedDMUserId(null);
    navigate("/channels/@me");
  };

  const handleSelectDM = (dmUserId: string) => {
    setSelectedView("dm");
    setSelectedDMUserId(dmUserId);
    navigate(`/dm/${dmUserId}`);
  };

  return (
    <div className="flex h-screen bg-[#313338] text-white overflow-hidden w-full">
      {/* Left Sidebar - Friends & DM List */}
      <DMSidebar
        onSelectFriends={handleSelectFriends}
        onSelectDM={handleSelectDM}
        selectedView={selectedView}
        selectedDMUserId={selectedDMUserId}
      />

      {/* Middle Panel - Friends or DM Chat */}
      {selectedView === "friends" ? (
        <FriendsPanel />
      ) : (
        selectedDMUserId && (
          <DirectMessageChat
            userId={selectedDMUserId}
            onToggleProfile={() => setShowProfile(!showProfile)}
          />
        )
      )}

      {/* Right Sidebar - Active Now OR User Profile */}
      {selectedView === "friends" ? (
        <ActiveNow />
      ) : (
        selectedDMUserId &&
        showProfile && <UserProfileSidebar userId={selectedDMUserId} />
      )}
    </div>
  );
};

export default DirectMessagesPage;
