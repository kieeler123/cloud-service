// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LoginPage from "./features/pages/LoginPage";
import DrivePage from "./features/drive/pages/DrivePage";
import AccountPage from "./features/pages/AccountPage";
import AppLayout from "./layouts/AppLayout";
import TrashPage from "./features/drive/pages/TrashPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import CloudHomePage from "./features/cloud/pages/CloudHomePage";
import AuthCallbackPage from "./features/pages/CallbackPage";

type MeResponse = {
  ok: boolean;
  user: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
};

async function fetchMe(token: string): Promise<MeResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("idToken") ?? "";

    if (!token) {
      setAuthed(false);
      setReady(true);
      return;
    }

    fetchMe(token)
      .then(() => setAuthed(true))
      .catch(() => {
        localStorage.removeItem("idToken");
        setAuthed(false);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <span className="text-xs sm:text-sm text-slate-400">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={authed ? <Navigate to="/" replace /> : <LoginPage />}
          />

          <Route
            path="/"
            element={
              authed ? (
                <AppLayout>
                  <DrivePage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route
            path="/cloud"
            element={
              authed ? (
                <AppLayout>
                  <CloudHomePage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/account"
            element={
              authed ? (
                <AppLayout>
                  <AccountPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/trash"
            element={
              authed ? (
                <AppLayout>
                  <TrashPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to={authed ? "/" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
