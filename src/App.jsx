import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import FeedPage from "./pages/FeedPage";
import Dashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="w-full min-h-screen bg-black">
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/feed"
          element={
            
              <FeedPage />
            
          }
        />
        <Route
          path="/dashboard"
          element={
            
              <Dashboard />
            
          }
        />
      </Routes>
    </div>
  );
};

export default App;