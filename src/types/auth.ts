// Auth-related request and response interfaces for OTP, Refresh/Logout/Me, and Google flows.

export type OtpChannel = 'EMAIL' | 'SMS';

// 1. OTP
export interface OtpRequestCreateRequest {
  channel: OtpChannel;
  identifier: string; // email or phone
}

export interface OtpRequestCreateResponse {
  expiresInSeconds: number;
}

export interface OtpVerifyRequest {
  identifier: string;
  code: string;
  deviceId?: string;
}

export interface OtpVerifyResponse extends AuthTokens {
  userId: string;
  sessionId: string;
}

// 2. Refresh / Logout / Me
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface UserResponse {
  id: string;
  username: string;
  primaryEmail: string;
  profile?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  goals?: Record<string, unknown>;
  status?: string;
  roles: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Google
export interface GoogleVerifyRequest {
  idToken: string;
  deviceId?: string;
}

export interface AuthResultResponse {
  user?: UserResponse;
  tokens?: AuthTokens;
  linkRequired?: boolean;
  linkTicketId?: string;
  message?: string;
}

export interface LinkConfirmRequest {
  linkTicketId: string;
  deviceId?: string;
}

export interface LinkRejectRequest {
  linkTicketId: string;
}
