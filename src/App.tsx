// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";

import LoginPage from "./pages/LoginPage";
import DrivePage from "./pages/DrivePage";
import AccountPage from "./pages/AccountPage";
import AppLayout from "./layouts/AppLayout";
import TrashPage from "./pages/TrashPage";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("[App] onAuthStateChanged:", firebaseUser);
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  if (user === undefined) {
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
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />

          <Route
            path="/"
            element={
              user ? (
                <AppLayout>
                  <DrivePage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/account"
            element={
              user ? (
                <AppLayout>
                  <AccountPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
          <Route
            path="/trash"
            element={
              user ? (
                <AppLayout>
                  <TrashPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
