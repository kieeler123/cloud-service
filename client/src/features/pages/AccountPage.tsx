import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { MeResponse } from "@/shared/types/auth";

async function fetchMe(token: string): Promise<MeResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_ME");
  }

  return res.json();
}

export default function AccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse["user"] | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("idToken") ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe(token)
      .then((data) => {
        setMe(data.user);
        setError(null);
      })
      .catch(() => {
        setError("계정 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("idToken");
    window.location.href = "/login";
  };

  if (!token) {
    return (
      <div className="text-sm text-slate-300">로그인 상태가 아닙니다.</div>
    );
  }

  if (loading) {
    return <div className="text-sm text-slate-400">불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-300">{error}</div>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          {t("account.title") ?? "계정 설정"}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          현재는 계정 정보 확인과 로그아웃만 지원합니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
        <div className="mb-2">
          <span className="text-slate-400">이름: </span>
          {me?.name || "-"}
        </div>
        <div className="mb-2">
          <span className="text-slate-400">이메일: </span>
          {me?.email || "-"}
        </div>
        <div>
          <span className="text-slate-400">UID: </span>
          {me?.uid || "-"}
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60"
      >
        {t("layout.logout") ?? "Logout"}
      </button>
    </div>
  );
}
