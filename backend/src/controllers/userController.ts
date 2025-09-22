import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse, PaginationQuery } from '@/types/common';
import logger from '@/utils/logger';

export class UserController {
  // Get all users with pagination
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        role = '',
        isActive = '',
      } = req.query as PaginationQuery & {
        search?: string;
        role?: string;
        isActive?: string;
      };

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (isActive !== '') {
        where.isActive = isActive === 'true';
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take,
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            role: true,
            warehouseId: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        pagination: {
          page: Number(page),
          limit: take,
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get users controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
      } as ApiResponse);
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          warehouseId: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

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
      logger.error('Get user by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
      } as ApiResponse);
    }
  }

  // Create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {
        username,
        email,
        fullName,
        password,
        role,
        warehouseId,
      } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email },
          ],
        },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this username or email already exists',
        } as ApiResponse);
        return;
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          fullName,
          password: hashedPassword,
          role,
          warehouseId: warehouseId || null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          warehouseId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Create user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
      } as ApiResponse);
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove password from update data if present
      delete updateData.password;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          warehouseId: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
      } as ApiResponse);
    }
  }

  // Deactivate user
  static async deactivateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.update({
        where: { id },
        data: { isActive: false },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
        data: user,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Deactivate user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate user',
      } as ApiResponse);
    }
  }
}
