import LandingPage from "@/pages/home/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MediaQueryProvider } from "@/context/media-query-context";
import LoginPage from "./pages/authentication/Login-page";
import SignupPage from "./pages/authentication/Signup-page";
import AuthSuccessPage from "./pages/authentication/AuthSuccessPage";
// import DashboardPage from "./pages/dashboard/dashboard-page";
import DashboardPage from "./pages/dashboard/NewDashboardPage";
import DirectMessagesPage from "./pages/dashboard/DirectMessagesPage";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import InvitePage from "./pages/server/invite-page";
import NotFoundPage from "./pages/NotFoundPage";
// import DashboardLayout from "./pages/dashboard/dashboard-layout";
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
import { handleIncomingMessage, updateMessage } from "@/store/slices/dmSlice";
import type { RootState, AppDispatch } from "@/store/store";

const AppComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

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

        // Listeners for User Status
        socket.on("user_connected", (payload) => {
          if (payload.userId) {
            dispatch(
              updateFriendStatus({ userId: payload.userId, status: "online" })
            );
          }
        });

        socket.on("user_disconnected", (payload) => {
          if (payload.userId) {
            dispatch(
              updateFriendStatus({ userId: payload.userId, status: "offline" })
            );
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
      <header>
        <Routes>
          {/* Public Routes (Accessible only if NOT logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/success" element={<AuthSuccessPage />} />
          </Route>

          {/* Protected Routes (Accessible only if logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/server/:id" element={<DashboardPage />} />
            <Route
              path="/server/:serverId/invite/:invitecode"
              element={<InvitePage />}
            />

            <Route path="/channels/@me" element={<DirectMessagesPage />} />
            <Route path="/dm/:userId" element={<DirectMessagesPage />} />
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
