import { createClientErrorLog } from "../utils/clientErrorLog";

type Params = {
  file: File;
  onProgress?: (progress: number) => void;
};

type UploadResult = {
  ok: boolean;
  fileId: string;
  path: string;
  downloadURL: string;
};

export function uploadSingleDriveFile({
  file,
  onProgress,
}: Params): Promise<UploadResult> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const token = localStorage.getItem("idToken") ?? "";

  if (!token) {
    return Promise.reject(new Error("UNAUTHORIZED"));
  }

  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${baseUrl}/api/cloud-files/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress?.(progress);
    };

    xhr.onerror = () => {
      const error = new Error("NETWORK_ERROR");

      createClientErrorLog({
        action: "UPLOAD_FILE",
        code: "CLIENT_NETWORK_ERROR",
        message: "Upload request failed",
        rawMessage: error.message,
        meta: {
          endpoint: "/api/cloud-files/upload",
        },
      });

      reject(error);
    };

    xhr.ontimeout = () => {
      createClientErrorLog({
        action: "UPLOAD_FILE",
        code: "CLIENT_TIMEOUT",
        message: "Upload timeout",
      });

      reject(new Error("TIMEOUT"));
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}");

        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(data?.code || "FAILED_TO_UPLOAD_FILE"));
          return;
        }

        resolve(data);
      } catch {
        reject(new Error("FAILED_TO_UPLOAD_FILE"));
      }
    };

    xhr.send(formData);
  });
}
