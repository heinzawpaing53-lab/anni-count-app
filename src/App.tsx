import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Timeline } from "./pages/Timeline";
import { Settings } from "./pages/Settings";
import { AuthPage } from "./pages/AuthPage";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { useAuth } from "./context/AuthContext";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="romantic-surface bg-card/90 px-8 py-6 text-center ring-1 ring-border/60 dark:bg-[#111827]">
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
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
