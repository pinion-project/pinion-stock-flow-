import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import prisma from '@/config/database';
import { User, UserRole, LoginCredentials, LoginResponse, JWTPayload } from '@/types/auth';
import logger from '@/utils/logger';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  // Generate refresh token
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { username: credentials.username },
        include: {
          warehouse: true,
        },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const payload: JWTPayload = {
        id: user.id,
        userId: user.id,  // Keep for backward compatibility
        username: user.username,
        role: user.role as UserRole,
        warehouseId: user.warehouseId || undefined,
      };

      const token = this.generateToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword as User,
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          warehouse: true,
        },
      });

      if (!user) {
        return null;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      logger.error('Get current user error:', error);
      return null;
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const payload = this.verifyRefreshToken(refreshToken);
      const user = await this.getCurrentUser(payload.userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const newPayload: JWTPayload = {
        id: user.id,
        userId: user.id,
        username: user.username,
        role: user.role as UserRole,
        warehouseId: user.warehouseId || undefined,
      };

      const newToken = this.generateToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedNewPassword = await this.hashPassword(newPassword);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  // Logout (invalidate token - in a real app, you'd maintain a blacklist)
  static logout(): void {
    // In a production app, you would add the token to a blacklist
    // For now, we'll rely on client-side token removal
    logger.info('User logged out');
  }
}
