import { OAuth2Client } from 'google-auth-library';
import AuthDao from './auth.dao.js';
import { hashPassword, comparePassword } from '../../utils/password.util.js';
import { generateAccessToken } from '../../utils/jwt.util.js';
import emailService from '../../services/email.service.js';
import crypto from 'crypto';
import {
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
  EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS,
  REFRESH_TOKEN_EXPIRY_MS,
  AUTH_REDIS_EXPIRY_SECONDS,
} from '../../constants/auth.constants.js';
import cacheService from '../../services/cache.service.js';
import { generateJWTPayload, generateSessionPayload } from '../../builders/payload.builder.js';
import { generateAuthSessionKey } from '../../builders/redis-key.builder.js';
import type { EmailVerificationInput, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from './auth.validation.js';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../utils/error.utils.js';

class AuthService {
  private authDao: AuthDao;

  private googleClient: OAuth2Client;

  constructor() {
    this.authDao = new AuthDao();
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);
  }

  // Helper to generate random token
  _generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Helper to hash token
  _hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register(data: RegisterInput) {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await this.authDao.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Set default role and verification status
    const userData = { name, email, password_hash };

    let user = await this.authDao.createUser(userData);

    // Generate email verification token
    const verificationToken = this._generateRandomToken();
    const tokenHash = this._hashToken(verificationToken);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await this.authDao.createEmailVerificationToken({
      userId: user.id,
      token_hash: tokenHash,
      expiresAt,
    });

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    // Find user by email
    const user = await this.authDao.findUserByEmail(email, { include_password_hash: true });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Compare passwords
    if (!user.password_hash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await this.authDao.updateUser(user.id, { lastLoginAt: new Date() });

    const refreshToken = this._generateRandomToken();
    const refreshTokenHash = this._hashToken(refreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    const sessionId = crypto.randomUUID();
    const sessionKey = generateAuthSessionKey(user.id, sessionId);

    await this.authDao.createRefreshToken({
      userId: user.id,
      token_hash: refreshTokenHash,
      sessionId: sessionId,
      expiresAt: refreshTokenExpiresAt,
    });

    const sessionPayload = generateSessionPayload(user, refreshTokenHash);

    await cacheService.set(sessionKey, sessionPayload, AUTH_REDIS_EXPIRY_SECONDS);

    // Generate tokens
    const payload = generateJWTPayload(user, sessionId);
    const accessToken = generateAccessToken(payload);

    const { password_hash, ...userWithoutPassword } = user as Record<string, any>;

    return {
      message: 'Login successful',
      accessToken, refreshToken,
      user: userWithoutPassword,
    };
  }

  async googleLogin(idToken: string) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new BadRequestError('Google login is not configured');
    }

    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });
      payload = ticket.getPayload();
    } catch (error) {
      throw new UnauthorizedError('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedError('Invalid Google token payload');
    }

    const { email, name, picture, sub: googleId } = payload;

    // Find user by email
    let user = await this.authDao.findUserByEmail(email, { include_password_hash: true });

    if (!user) {
      // Create new user if not exists
      const newUser = await this.authDao.createUser({
        email: email as string,
        name: (name || email.split('@')[0]) as string,
      });
      // Mark as verified since it's Google
      await this.authDao.updateUser(newUser.id, { isVerified: true });

      // Fetch user again to get the full object (with optional password_hash)
      user = await this.authDao.findUserByEmail(email, { include_password_hash: true });
    }

    const userForAuth = user!; // Guaranteed to exist now

    if (!userForAuth.isActive) {
      throw new UnauthorizedError('Account is disabled');
    }

    await this.authDao.updateUser(userForAuth.id, { lastLoginAt: new Date() });

    const refreshToken = this._generateRandomToken();
    const refreshTokenHash = this._hashToken(refreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    const sessionId = crypto.randomUUID();
    const sessionKey = generateAuthSessionKey(userForAuth.id, sessionId);

    await this.authDao.createRefreshToken({
      userId: userForAuth.id,
      token_hash: refreshTokenHash,
      sessionId: sessionId,
      expiresAt: refreshTokenExpiresAt,
    });

    const sessionPayload = generateSessionPayload(userForAuth as any, refreshTokenHash);
    await cacheService.set(sessionKey, sessionPayload, AUTH_REDIS_EXPIRY_SECONDS);

    const jwtPayload = generateJWTPayload(userForAuth as any, sessionId);
    const accessToken = generateAccessToken(jwtPayload);

    const { password_hash, ...userWithoutPassword } = userForAuth as Record<string, any>;

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async logout(userId: string, refreshToken: string, sessionId: string) {
    // Revoke current refresh token for the user
    const refreshTokenHash = this._hashToken(refreshToken);
    const refreshTokenRecord = await this.authDao.findRefreshToken(refreshTokenHash);

    if (refreshTokenRecord) {
      await this.authDao.revokeRefreshToken(refreshTokenRecord.id);
    }

    // Clear session by sessionId from Redis
    const sessionKey = generateAuthSessionKey(userId, sessionId);
    await cacheService.del(sessionKey);

    return {
      message: 'Logout successful',
    };
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const { email } = data;

    // Find user by email
    const user = await this.authDao.findUserByEmail(email);

    // Always return success message even if user not found (security best practice)
    if (!user) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent',
      };
    }

    // Generate password reset token
    const resetToken = this._generateRandomToken();
    const tokenHash = this._hashToken(resetToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await this.authDao.createPasswordResetToken({
      userId: user.id,
      token_hash: tokenHash,
      expiresAt,
    });

    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    return {
      message: 'If an account with that email exists, a password reset link has been sent',
    };
  }

  async resetPassword(data: ResetPasswordInput) {
    const { token, password } = data;

    // Hash the token to find it in database
    const tokenHash = this._hashToken(token);

    // Find the reset token
    const resetToken = await this.authDao.findPasswordResetToken(tokenHash);
    const user = resetToken?.user;

    if (!resetToken || !user?.isActive) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    // Hash new password
    const password_hash = await hashPassword(password);

    // Update user password and mark token as used
    await this.authDao.updateUserPassword(resetToken.userId, password_hash);
    await this.authDao.usePasswordResetToken(resetToken.id);

    // Revoke all refresh tokens for the user
    await this.authDao.revokeAllRefreshTokens(resetToken.userId);

    // Clear all sessions for the user
    const sessionKeyPattern = generateAuthSessionKey(resetToken.userId, '*');
    await cacheService.clear(sessionKeyPattern);

    return {
      message: 'Password reset successful. You can now login with your new password',
    };
  }

  async verifyEmail({ token }: EmailVerificationInput) {
    // Hash the token to find it in database
    const tokenHash = this._hashToken(token);

    // Find the verification token
    const verificationToken = await this.authDao.findEmailVerificationToken(tokenHash);

    if (!verificationToken) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    // Find user by ID
    const user = await this.authDao.findUserById(verificationToken.userId);
    if (!user || !user.isActive) {
      throw new BadRequestError('Invalid verification token');
    }

    // Mark user as verified
    await this.authDao.updateUser(verificationToken.userId, { isVerified: true });

    return {
      message: 'Email verified successfully',
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError('Unauthorized. Please login to continue');
    }
    const refreshTokenHash = this._hashToken(refreshToken);

    const refreshTokenRecord = await this.authDao.findRefreshToken(refreshTokenHash);
    const user = refreshTokenRecord?.user;

    if (!refreshTokenRecord || !user?.isActive) {
      throw new UnauthorizedError('Invalid or revoked refresh token');
    }

    if (refreshTokenRecord?.isRevoked) {
      // Handle Replay Attack
      const oldSessionKey = generateAuthSessionKey(refreshTokenRecord.userId, refreshTokenRecord.sessionId);
      await cacheService.del(oldSessionKey);
      throw new UnauthorizedError('Refresh token has been revoked. Please login again');
    }

    await this.authDao.revokeRefreshToken(refreshTokenRecord.id);

    const sessionId = refreshTokenRecord.sessionId;
    const sessionKey = generateAuthSessionKey(user.id, sessionId);

    const newRefreshToken = this._generateRandomToken();
    const newRefreshTokenHash = this._hashToken(newRefreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
    await this.authDao.createRefreshToken({
      userId: user.id,
      token_hash: newRefreshTokenHash,
      sessionId: sessionId,
      expiresAt: refreshTokenExpiresAt,
    });

    // Update session in Redis with new refresh token hash and expiry
    const sessionPayload = generateSessionPayload(user, newRefreshTokenHash);
    await cacheService.set(sessionKey, sessionPayload, AUTH_REDIS_EXPIRY_SECONDS);

    // Generate new access token
    const payload = generateJWTPayload(user, sessionId);
    const accessToken = generateAccessToken(payload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: refreshTokenRecord.user,
    };
  }

  async cleanupExpiredTokens() {
    await this.authDao.deleteExpiredRefreshTokens();
    await this.authDao.deleteExpiredEmailVerificationTokens();
    await this.authDao.deleteExpiredPasswordResetTokens();
  }
}

export default AuthService;
