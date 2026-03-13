import { Prisma } from '@prisma/client';
import prismaClient from '../../config/prisma.js';

class AuthDao {
  // User operations
  async findUserByEmail(email: string, options: { include_password_hash?: boolean } = { include_password_hash: false }) {
    const { include_password_hash } = options;
    return await prismaClient.user.findUnique({
      where: { email },
      omit: {
        password_hash: !include_password_hash
      }
    });
  }

  async findUserById(id: string, options: { include_password_hash?: boolean } = { include_password_hash: false }) {
    const { include_password_hash } = options;
    return await prismaClient.user.findUnique({
      where: { id },
      omit: {
        password_hash: !include_password_hash
      }
    });
  }

  async createUser(userData: Prisma.UserCreateInput) {
    return await prismaClient.user.create({
      data: userData,
      omit: { password_hash: true }
    });
  }

  async updateUser(userId: string, userData: Prisma.UserUpdateInput) {
    return await prismaClient.user.update({
      where: { id: userId },
      data: userData,
      omit: { password_hash: true }
    });
  }

  async updateUserPassword(userId: string, password_hash: string) {
    return await prismaClient.user.update({
      where: { id: userId },
      data: {
        password_hash,
        lastPasswordChangeAt: new Date()
      },
      omit: { password_hash: true }
    })
  }

  // Email verification token operations
  async createEmailVerificationToken(tokenData: { userId: string; token_hash: string; expiresAt: Date }) {
    return await prismaClient.emailVerificationToken.create({
      data: tokenData,
    });
  }

  async findEmailVerificationToken(tokenHash: string, options: { include_password_hash?: boolean } = { include_password_hash: false }) {
    const { include_password_hash } = options;
    // find a valid (non-expired) verification token by its hash
    return await prismaClient.emailVerificationToken.findFirst({
      include: {
        user: {
          omit: {
            password_hash: !include_password_hash
          }
        }
      },
      where: {
        token_hash: tokenHash,
        expiresAt: { gt: new Date() }, // Only find valid (non-expired) tokens
      }
    });
  }

  // Clean up expired email verification tokens
  async deleteExpiredEmailVerificationTokens() {
    return await prismaClient.emailVerificationToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      },
    });
  }

  // Password reset token operations
  async createPasswordResetToken(tokenData: { userId: string; token_hash: string; expiresAt: Date }) {
    return await prismaClient.passwordResetToken.create({
      data: tokenData,
    });
  }

  async findPasswordResetToken(tokenHash: string, options: { include_password_hash?: boolean } = { include_password_hash: false }) {
    const { include_password_hash } = options;
    // find a valid (non-expired, non-used) reset token by its hash
    return await prismaClient.passwordResetToken.findFirst({
      include: {
        user: {
          omit: {
            password_hash: !include_password_hash
          }
        }
      },
      where: {
        token_hash: tokenHash,
        expiresAt: { gt: new Date() }, // Only find valid (non-expired) tokens
        isUsed: false, // Only find tokens that haven't been used yet
      }
    });
  }

  async usePasswordResetToken(tokenId: string) {
    return await prismaClient.passwordResetToken.update({
      where: { id: tokenId },
      data: { isUsed: true },
    });
  }

  // Clean up expired password reset tokens
  async deleteExpiredPasswordResetTokens() {
    return await prismaClient.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  // Refresh token operations
  async createRefreshToken(tokenData: { userId: string; token_hash: string; sessionId: string; expiresAt: Date }) {
    return await prismaClient.refreshToken.create({
      data: tokenData,
    });
  }

  async findRefreshToken(tokenHash: string, options: { include_password_hash?: boolean } = { include_password_hash: false }) {
    const { include_password_hash } = options;
    return await prismaClient.refreshToken.findFirst({
      include: {
        user: {
          omit: {
            password_hash: !include_password_hash
          }
        }
      },
      where: {
        token_hash: tokenHash,
        expiresAt: { gt: new Date() }, // Only find valid (non-expired) tokens
      }
    });
  }

  async revokeRefreshToken(tokenId: string) {
    return await prismaClient.refreshToken.update({
      where: { id: tokenId },
      data: { isRevoked: true },
    });
  }

  async revokeAllRefreshTokens(userId: string) {
    return await prismaClient.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  // Clean up expired refresh tokens
  async deleteExpiredRefreshTokens() {
    return await prismaClient.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}

export default AuthDao;
