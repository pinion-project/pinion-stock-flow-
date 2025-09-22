import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { LoginCredentials } from '@/types/auth';
import { ApiResponse } from '@/types/common';
import logger from '@/utils/logger';

export class AuthController {
  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginCredentials = req.body;

      // Basic validation
      if (!credentials.username || !credentials.password) {
        res.status(400).json({
          success: false,
          message: 'Username and password are required',
        } as ApiResponse);
        return;
      }

      const result = await AuthService.login(credentials);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Login controller error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      } as ApiResponse);
    }
  }

  // Get current user
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        } as ApiResponse);
        return;
      }

      const user = await AuthService.getCurrentUser(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get current user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user information',
      } as ApiResponse);
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        } as ApiResponse);
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Refresh token controller error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid refresh token',
      } as ApiResponse);
    }
  }

  // Logout user
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return success
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      } as ApiResponse);
    }
  }
}
