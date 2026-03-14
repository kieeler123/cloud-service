export type MeUser = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type AuthMeResponse = {
  ok: boolean;
  user: MeUser;
};
