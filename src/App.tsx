import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Timeline } from "./pages/Timeline";
import { Settings } from "./pages/Settings";
import { AuthPage } from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="romantic-surface bg-[#F7FBFF] px-8 py-6 text-center">
        <p className="font-serif text-xl text-primary">Loading your love story...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      {user ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      )}
    </Router>
  );
}
