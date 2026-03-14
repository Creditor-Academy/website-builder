export type AuthUser = {
  id: string;
  role: string;
  refreshTokenId: string;
};

export type JWTPayload = {
  userId: string;
  role: string;
  refreshTokenId: string;
  sessionId: string;
};