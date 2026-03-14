import type {
  DeleteAccountParams,
  MeResponse,
  UpdateProfileParams,
  UploadProfilePhotoParams,
} from "@/shared/types/auth";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${baseUrl}/api/auth/google/start`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch me");
  }

  return res.json();
}

export async function updateMyProfile({
  token,
  displayName,
}: UpdateProfileParams) {
  const res = await fetch(`${baseUrl}/api/account/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayName,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}

export async function uploadMyProfilePhoto({
  token,
  file,
}: UploadProfilePhotoParams) {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch(`${baseUrl}/api/account/photo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload profile photo");
  }

  return res.json();
}

export async function deleteMyAccount({ token }: DeleteAccountParams) {
  const res = await fetch(`${baseUrl}/api/account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to delete account");
  }

  return res.json();
}
