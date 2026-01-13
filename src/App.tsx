import LandingPage from "@/pages/home/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { MediaQueryProvider } from "@/context/media-query-context";
import LoginPage from "./pages/authentication/Login-page";
import SignupPage from "./pages/authentication/Signup-page";
import AuthSuccessPage from "./pages/authentication/AuthSuccessPage";
// import DashboardPage from "./pages/dashboard/dashboard-page";
import DashboardPage from "./pages/dashboard/NewDashboardPage";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import CreateServer from "./pages/server/create-server";
import InvitePage from "./pages/server/invite-page";
// import DashboardLayout from "./pages/dashboard/dashboard-layout";

const AppComponent = () => {
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

            {/* New Dashboard with layout */}
            {/* <Route element={<DashboardLayout />}>
              <Route path="/server/:id" element={<DashboardPage />} />
              </Route>
            </Route> */}
          </Route>

          {/* Protected Routes (Accessible only if logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/server/:id" element={<DashboardPage />} />
            <Route path="/server/:serverId/invite/:invitecode" element={<InvitePage />} />
            <Route path="/server/create/new" element={<CreateServer />} />
          </Route>
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
