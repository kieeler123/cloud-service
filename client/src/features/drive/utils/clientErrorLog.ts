function readPendingClientErrorLogs(): Record<string, unknown>[] {
  try {
    const raw = localStorage.getItem("pending_client_error_logs");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("failed to parse pending_client_error_logs:", error);
    return [];
  }
}

function writePendingClientErrorLogs(logs: Record<string, unknown>[]) {
  localStorage.setItem(
    "pending_client_error_logs",
    JSON.stringify(logs.slice(-100)),
  );
}

export async function createClientErrorLog(payload: Record<string, unknown>) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const token = localStorage.getItem("idToken") ?? "";

  const log = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${baseUrl}/api/cloud-files/client-error-logs/bulk`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          logs: [log],
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`FAILED_TO_SEND_CLIENT_ERROR_LOG: ${res.status}`);
    }

    console.log("client error log sent immediately");
  } catch (error) {
    console.error("failed to send client error log immediately:", error);

    const logs = readPendingClientErrorLogs();
    const nextLogs = [...logs, log].slice(-100);

    writePendingClientErrorLogs(nextLogs);
    console.log("client error log saved to localStorage");
  }
}

export async function flushClientErrorLogs() {
  const logs = readPendingClientErrorLogs();

  if (!logs.length) return;

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
    const token = localStorage.getItem("idToken") ?? "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log("token:", token);
    console.log("logs:", logs);

    const res = await fetch(
      `${baseUrl}/api/cloud-files/client-error-logs/bulk`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ logs }),
      },
    );

    console.log("🔥 flush status:", res.status);

    const text = await res.text();
    console.log("🔥 flush response:", text);

    if (!res.ok) {
      throw new Error(`FAILED_TO_FLUSH: ${res.status}`);
    }

    localStorage.removeItem("pending_client_error_logs");
    console.log("client error logs flushed successfully");
  } catch (error) {
    console.error("failed to flush client error logs:", error);
  }
}
