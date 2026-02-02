import LandingPage from "@/pages/home/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { MediaQueryProvider } from "@/context/media-query-context";
import LoginPage from "./pages/authentication/Login-page";
import SignupPage from "./pages/authentication/Signup-page";
import VerifyOtpPage from "./pages/authentication/verify-otp-page";
import ForgotPasswordPage from "./pages/authentication/forgot-password-page";
import ResetPasswordPage from "./pages/authentication/reset-password-page";
import AuthSuccessPage from "./pages/authentication/AuthSuccessPage";
import DashboardPage from "./pages/dashboard/NewDashboardPage";
import DirectMessagesPage from "./pages/dashboard/DirectMessagesPage";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import ArchitecturePage from "./pages/ArchitecturePage";

import InvitePage from "./pages/server/invite-page";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "@/services/socket.service";
import {
  addPendingRequest,
  addSentRequest,
  removePendingRequest,
  removeSentRequest,
  addFriend,
  removeFriendFromList,
  updateFriendStatus,
} from "@/store/slices/friendSlice";
import { fetchMe } from "@/store/slices/authSlice";
import {
  handleIncomingMessage,
  updateMessage,
  updateParticipantStatus,
} from "@/store/slices/dmSlice";
import type { RootState, AppDispatch } from "@/store/types";
import DirectCallPage from "./pages/dashboard/direct-call-page";
import { setChannelType, setIncomingCall } from "./store/slices/callSlice";
import IncomingCallModal from "./components/calls/IncomingCallModal";
import DiscoveryPage from "./pages/discover/discovery-dashboard";

const AppComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (user) {
      socketService.connect();
      const socket = socketService.getSocket();

      if (socket) {
        // Listeners for Real-time Friend Updates
        socket.on("friend_request_sent", (request) => {
          dispatch(addSentRequest(request));
        });

        socket.on("friend_request_received", (request) => {
          dispatch(addPendingRequest(request));
        });

        socket.on("friend_request_accepted", (payload) => {
          // Payload usually contains the requestId and the new friend data
          // Adjust based on actual backend event structure.
          // Assuming: { requestId: string, friend: Friend, request: FriendRequest }
          if (payload.requestId) {
            dispatch(removeSentRequest(payload.requestId));
            dispatch(removePendingRequest(payload.requestId));
          }
          if (payload.friend) {
            dispatch(addFriend(payload.friend));
          }
        });

        socket.on("friend_request_rejected", (payload) => {
          if (payload.requestId) dispatch(removeSentRequest(payload.requestId));
        });

        socket.on("friend_request_cancelled", (payload) => {
          if (payload.requestId)
            dispatch(removePendingRequest(payload.requestId));
        });

        socket.on("friend_removed", (payload) => {
          if (payload.friendId)
            dispatch(removeFriendFromList(payload.friendId));
        });

        // Listeners for Real-time Direct Messages
        socket.on("direct_message_received", (message) => {
          dispatch(handleIncomingMessage(message));
        });

        socket.on("direct_message_sent", (message) => {
          dispatch(handleIncomingMessage(message));
        });

        // Listeners for Message Actions
        socket.on("message_pinned", (message) => {
          dispatch(updateMessage(message));
        });

        socket.on("message_unpinned", (message) => {
          dispatch(updateMessage(message));
        });

        socket.on("message_deleted", (message) => {
          dispatch(updateMessage(message));
        });

        socket.on("reaction_added", (message) => {
          dispatch(updateMessage(message));
        });

        socket.on("reaction_removed", (message) => {
          dispatch(updateMessage(message));
        });

        // Listener for Incoming Calls
        socket.on("incoming_call", (payload) => {
          dispatch(
            setIncomingCall({
              token: payload.token,
              roomName: payload.roomName,
              fromFriendId: payload.fromFriendId,
              fromFriendName: payload.fromFriendName,
              channelType: payload.channelType,
            }),
          );
          dispatch(setChannelType(payload.channelType as "VIDEO" | "AUDIO"));

          // console.log("App.tsx", payload.channelType);
        });

        // Listeners for User Status
        socket.on("user_connected", (payload) => {
          if (payload.userId) {
            dispatch(
              updateFriendStatus({ userId: payload.userId, status: "online" }),
            );
            // Also update DM participants
            dispatch(
              updateParticipantStatus({
                userId: payload.userId,
                status: "online",
              }),
            );
          }
        });

        socket.on("user_disconnected", (payload) => {
          if (payload.userId) {
            dispatch(
              updateFriendStatus({ userId: payload.userId, status: "offline" }),
            );
            // Also update DM participants
            dispatch(
              updateParticipantStatus({
                userId: payload.userId,
                status: "offline",
              }),
            );
          }
        });

        // Handle initial online friends list
        socket.on("online_friends", (payload) => {
          if (payload.userIds && Array.isArray(payload.userIds)) {
            payload.userIds.forEach((userId: string) => {
              dispatch(updateFriendStatus({ userId, status: "online" }));
              dispatch(updateParticipantStatus({ userId, status: "online" }));
            });
          }
        });
      }
    }

    return () => {
      // socketService.disconnect(); // We might not want to fully disconnect if just navigating?
      // Actually strictly disconnect is good for cleanup.
      // But let's explicit remove listeners too if possible, but disconnect is enough.
      socketService.disconnect();
    };
  }, [user?.id, dispatch]);

  return (
    <MediaQueryProvider>
      <IncomingCallModal />
      <header>
        <Routes>
          {/* Authentication Routes (Always accessible) */}
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/arc" element={<ArchitecturePage />} />

          {/* Public Routes (Accessible only if NOT logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/success" element={<AuthSuccessPage />} />
          </Route>

          {/* Protected Routes (Accessible only if logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/server/:serverId" element={<DashboardPage />} />
            <Route
              path="/server/:serverId/:channelId"
              element={<DashboardPage />}
            />
            <Route
              path="/server/:serverId/invite/:invitecode"
              element={<InvitePage />}
            />

            <Route path="/channels/@me" element={<DirectMessagesPage />} />
            <Route path="/dm/:userId" element={<DirectMessagesPage />} />

            {/* Discovery */}
            <Route
              path="/discovery/:discoveryTab"
              element={<DiscoveryPage />}
            />

            {/* One on One Call */}
            <Route path="/call/:userId/:roomId" element={<DirectCallPage />} />
            <Route path="/video/:userId/:roomId" element={<DirectCallPage />} />
          </Route>

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </header>
    </MediaQueryProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  );
};

export default App;
