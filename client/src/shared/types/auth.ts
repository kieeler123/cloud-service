export type MeUser = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type MeResponse = {
  ok: boolean;
  user: MeUser;
};

export type UpdateProfileParams = {
  token: string;
  displayName: string;
};

export type UploadProfilePhotoParams = {
  token: string;
  file: File;
};

export type DeleteAccountParams = {
  token: string;
};
