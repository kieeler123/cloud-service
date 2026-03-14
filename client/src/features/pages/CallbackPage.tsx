import { useEffect } from "react";

export default function AuthCallbackPage() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const token = params.get("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    localStorage.setItem("idToken", token);
    window.location.href = "/";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      로그인 처리 중...
    </div>
  );
}
