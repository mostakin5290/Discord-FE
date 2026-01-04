import LandingPage from "@/pages/home/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/authentication/Login-page";
import SignupPage from "./pages/authentication/Signup-page";
import AuthSuccessPage from "./pages/authentication/AuthSuccessPage";
import DashboardPage from "./pages/dashboard/NewDashboardPage";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import CreateServer from "./pages/server/create-server";

const AppComponent = () => {
  return (
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
          <Route path="/channels/@me" element={<DashboardPage />} />
          <Route path="/server/create/new" element={<CreateServer />}></Route>
        </Route>
      </Routes>
    </header>
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
