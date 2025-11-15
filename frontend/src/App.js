import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AgentDetail from "./pages/AgentDetail";
import TopAgents from "./pages/TopAgents";
import Profile from "./pages/Profile"; // <-- ADD THIS IMPORT
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/:agentUuid"
          element={
            <ProtectedRoute>
              <AgentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-agents"
          element={
            <ProtectedRoute>
              <TopAgents />
            </ProtectedRoute>
          }
        />
        {/* ADD NEW PROFILE ROUTE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;