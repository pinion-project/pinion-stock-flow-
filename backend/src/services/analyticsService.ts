import prisma from '@/config/database';
import logger from '@/utils/logger';

export interface DashboardMetrics {
  totalProducts: number;
  totalWarehouses: number;
  totalUsers: number;
  totalTransactions: number;
  totalValue: number;
  lowStockItems: number;
  recentTransactions: any[];
  topProducts: any[];
  warehouseUtilization: any[];
  monthlyTrends: any[];
}

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  turnoverRate: number;
  averageStockValue: number;
  categoryBreakdown: any[];
  warehouseBreakdown: any[];
  movementTrends: any[];
  abcAnalysis: any[];
}

export interface WarehousePerformance {
  warehouseId: string;
  warehouseName: string;
  utilizationRate: number;
  totalValue: number;
  totalItems: number;
  turnoverRate: number;
  efficiency: number;
  capacityUsed: number;
  capacityAvailable: number;
  recentActivity: any[];
}

export interface FinancialAnalytics {
  totalRevenue: number;
  totalCosts: number;
  profitMargin: number;
  monthlyRevenue: any[];
  monthlyCosts: any[];
  topSellingProducts: any[];
  supplierCosts: any[];
  categoryRevenue: any[];
  profitTrends: any[];
}

export interface ForecastingData {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
  nextOrderDate: Date;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

class AnalyticsService {
  // Get dashboard metrics
  public async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const [
        totalProducts,
        totalWarehouses,
        totalUsers,
        totalTransactions,
        totalValueResult,
        lowStockItems,
        recentTransactions,
        topProducts,
        warehouseUtilization,
        monthlyTrends
      ] = await Promise.all([
        prisma.product.count(),
        prisma.warehouse.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.transaction.count(),
        this.getTotalInventoryValue(),
        this.getLowStockCount(),
        this.getRecentTransactions(10),
        this.getTopProducts(10),
        this.getWarehouseUtilization(),
        this.getMonthlyTrends()
      ]);

      return {
        totalProducts,
        totalWarehouses,
        totalUsers,
        totalTransactions,
        totalValue: totalValueResult,
        lowStockItems,
        recentTransactions,
        topProducts,
        warehouseUtilization,
        monthlyTrends
      };
    } catch (error) {
      logger.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  // Get inventory analytics
  public async getInventoryAnalytics(warehouseId?: string): Promise<InventoryAnalytics> {
    try {
      const whereClause = warehouseId ? { warehouseId } : {};

      const [
        totalValue,
        totalItems,
        lowStockCount,
        outOfStockCount,
        turnoverRate,
        averageStockValue,
        categoryBreakdown,
        warehouseBreakdown,
        movementTrends,
        abcAnalysis
      ] = await Promise.all([
        this.getTotalInventoryValue(warehouseId),
        this.getTotalInventoryItems(warehouseId),
        this.getLowStockCount(warehouseId),
        this.getOutOfStockCount(warehouseId),
        this.getTurnoverRate(warehouseId),
        this.getAverageStockValue(warehouseId),
        this.getCategoryBreakdown(warehouseId),
        this.getWarehouseBreakdown(),
        this.getMovementTrends(warehouseId),
        this.getABCAnalysis(warehouseId)
      ]);

      return {
        totalValue,
        totalItems,
        lowStockCount,
        outOfStockCount,
        turnoverRate,
        averageStockValue,
        categoryBreakdown,
        warehouseBreakdown,
        movementTrends,
        abcAnalysis
      };
    } catch (error) {
      logger.error('Error getting inventory analytics:', error);
      throw error;
    }
  }

  // Get warehouse performance
  public async getWarehousePerformance(warehouseId?: string): Promise<WarehousePerformance[]> {
    try {
      const warehouses = await prisma.warehouse.findMany({
        where: warehouseId ? { id: warehouseId } : {},
        include: {
          inventory: {
            include: {
              product: true
            }
          }
        }
      });

      const performanceData = await Promise.all(
        warehouses.map(async (warehouse) => {
          const totalValue = warehouse.inventory.reduce((sum, inv) => {
            return sum + (inv.quantity * (inv.product as any).unitPrice || 0);
          }, 0);

          const totalItems = warehouse.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
          const utilizationRate = (warehouse.currentStock / warehouse.maxVolume) * 100;
          const turnoverRate = await this.getWarehouseTurnoverRate(warehouse.id);
          const efficiency = await this.getWarehouseEfficiency(warehouse.id);
          const recentActivity = await this.getWarehouseRecentActivity(warehouse.id, 10);

          return {
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            utilizationRate: Math.round(utilizationRate * 100) / 100,
            totalValue,
            totalItems,
            turnoverRate,
            efficiency,
            capacityUsed: warehouse.currentStock,
            capacityAvailable: warehouse.availableSpace,
            recentActivity
          };
        })
      );

      return performanceData;
    } catch (error) {
      logger.error('Error getting warehouse performance:', error);
      throw error;
    }
  }

  // Get financial analytics
  public async getFinancialAnalytics(startDate?: Date, endDate?: Date): Promise<FinancialAnalytics> {
    try {
      const dateFilter = {
        date: {
          gte: startDate || new Date(new Date().getFullYear(), 0, 1),
          lte: endDate || new Date()
        }
      };

      const [
        totalRevenue,
        totalCosts,
        monthlyRevenue,
        monthlyCosts,
        topSellingProducts,
        supplierCosts,
        categoryRevenue,
        profitTrends
      ] = await Promise.all([
        this.getTotalRevenue(dateFilter),
        this.getTotalCosts(dateFilter),
        this.getMonthlyRevenue(dateFilter),
        this.getMonthlyCosts(dateFilter),
        this.getTopSellingProducts(dateFilter, 10),
        this.getSupplierCosts(dateFilter),
        this.getCategoryRevenue(dateFilter),
        this.getProfitTrends(dateFilter)
      ]);

      const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;

      return {
        totalRevenue,
        totalCosts,
        profitMargin: Math.round(profitMargin * 100) / 100,
        monthlyRevenue,
        monthlyCosts,
        topSellingProducts,
        supplierCosts,
        categoryRevenue,
        profitTrends
      };
    } catch (error) {
      logger.error('Error getting financial analytics:', error);
      throw error;
    }
  }

  // Get forecasting data
  public async getForecastingData(warehouseId?: string): Promise<ForecastingData[]> {
    try {
      const products = await prisma.product.findMany({
        where: warehouseId ? { warehouseId } : {},
        include: {
          inventory: {
            where: warehouseId ? { warehouseId } : {}
          },
          transactions: {
            where: {
              date: {
                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
              }
            },
            orderBy: { date: 'desc' }
          }
        }
      });

      const forecastingData = products.map(product => {
        const currentStock = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
        const recentTransactions = product.transactions.slice(0, 30); // Last 30 transactions
        
        // Simple demand prediction based on recent transactions
        const totalQuantity = recentTransactions.reduce((sum, t) => sum + t.quantity, 0);
        const predictedDemand = totalQuantity / 30; // Average daily demand
        
        const recommendedOrder = Math.max(0, predictedDemand * 30 - currentStock); // 30-day supply
        const confidence = Math.min(100, recentTransactions.length * 3.33); // Based on transaction count
        
        const nextOrderDate = new Date();
        nextOrderDate.setDate(nextOrderDate.getDate() + Math.ceil(currentStock / Math.max(predictedDemand, 1)));
        
        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
        if (currentStock < predictedDemand * 7) riskLevel = 'HIGH';
        else if (currentStock < predictedDemand * 14) riskLevel = 'MEDIUM';

        return {
          productId: product.id,
          productName: product.name,
          currentStock,
          predictedDemand: Math.round(predictedDemand * 100) / 100,
          recommendedOrder: Math.round(recommendedOrder),
          confidence: Math.round(confidence),
          nextOrderDate,
          riskLevel
        };
      });

      return forecastingData.sort((a, b) => b.riskLevel.localeCompare(a.riskLevel));
    } catch (error) {
      logger.error('Error getting forecasting data:', error);
      throw error;
    }
  }

  // Helper methods
  private async getTotalInventoryValue(warehouseId?: string): Promise<number> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    const result = await prisma.inventory.aggregate({
      where: whereClause,
      _sum: {
        quantity: true
      }
    });

    // This is a simplified calculation - in reality you'd need product prices
    return result._sum.quantity || 0;
  }

  private async getTotalInventoryItems(warehouseId?: string): Promise<number> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    return await prisma.inventory.count({
      where: whereClause
    });
  }

  private async getLowStockCount(warehouseId?: string): Promise<number> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    return await prisma.inventory.count({
      where: {
        ...whereClause,
        quantity: {
          lte: prisma.inventory.fields.reorderPoint
        }
      }
    });
  }

  private async getOutOfStockCount(warehouseId?: string): Promise<number> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    return await prisma.inventory.count({
      where: {
        ...whereClause,
        quantity: 0
      }
    });
  }

  private async getTurnoverRate(warehouseId?: string): Promise<number> {
    // Simplified turnover rate calculation
    const whereClause = warehouseId ? { warehouseId } : {};
    
    const transactions = await prisma.transaction.findMany({
      where: {
        ...whereClause,
        date: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      }
    });

    const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const averageInventory = await this.getAverageInventory(warehouseId);
    
    return averageInventory > 0 ? totalQuantity / averageInventory : 0;
  }

  private async getAverageStockValue(warehouseId?: string): Promise<number> {
    const totalValue = await this.getTotalInventoryValue(warehouseId);
    const totalItems = await this.getTotalInventoryItems(warehouseId);
    
    return totalItems > 0 ? totalValue / totalItems : 0;
  }

  private async getCategoryBreakdown(warehouseId?: string): Promise<any[]> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    const result = await prisma.product.groupBy({
      by: ['category'],
      where: whereClause,
      _count: { category: true }
    });

    return result.map(item => ({
      category: item.category,
      count: item._count.category
    }));
  }

  private async getWarehouseBreakdown(): Promise<any[]> {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        _count: {
          select: { inventory: true }
        }
      }
    });

    return warehouses.map(warehouse => ({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      itemCount: warehouse._count.inventory,
      utilization: (warehouse.currentStock / warehouse.maxVolume) * 100
    }));
  }

  private async getMovementTrends(warehouseId?: string): Promise<any[]> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    const movements = await prisma.inventoryMovement.findMany({
      where: {
        ...whereClause,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { date: 'asc' }
    });

    // Group by date and movement type
    const trends = movements.reduce((acc, movement) => {
      const date = movement.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, in: 0, out: 0 };
      }
      if (movement.movementType === 'IN') {
        acc[date].in += movement.quantity;
      } else {
        acc[date].out += movement.quantity;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(trends);
  }

  private async getABCAnalysis(warehouseId?: string): Promise<any[]> {
    // Simplified ABC analysis based on transaction volume
    const whereClause = warehouseId ? { warehouseId } : {};
    
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        transactions: {
          where: {
            date: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
            }
          }
        }
      }
    });

    const productValues = products.map(product => ({
      productId: product.id,
      productName: product.name,
      totalValue: product.transactions.reduce((sum, t) => sum + t.totalAmount, 0)
    }));

    productValues.sort((a, b) => b.totalValue - a.totalValue);

    const totalValue = productValues.reduce((sum, p) => sum + p.totalValue, 0);
    let cumulativeValue = 0;

    return productValues.map((product, index) => {
      cumulativeValue += product.totalValue;
      const percentage = (cumulativeValue / totalValue) * 100;
      
      let category = 'C';
      if (percentage <= 80) category = 'A';
      else if (percentage <= 95) category = 'B';

      return {
        ...product,
        percentage: Math.round(percentage * 100) / 100,
        category
      };
    });
  }

  private async getRecentTransactions(limit: number): Promise<any[]> {
    return await prisma.transaction.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, sku: true } },
        warehouse: { select: { name: true } },
        user: { select: { fullName: true } }
      }
    });
  }

  private async getTopProducts(limit: number): Promise<any[]> {
    const result = await prisma.transaction.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit
    });

    return result.map(item => ({
      productId: item.productId,
      productName: item.productName,
      totalQuantity: item._sum.quantity
    }));
  }

  private async getWarehouseUtilization(): Promise<any[]> {
    const warehouses = await prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        currentStock: true,
        maxVolume: true,
        availableSpace: true
      }
    });

    return warehouses.map(warehouse => ({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      utilization: (warehouse.currentStock / warehouse.maxVolume) * 100,
      capacityUsed: warehouse.currentStock,
      capacityAvailable: warehouse.availableSpace
    }));
  }

  private async getMonthlyTrends(): Promise<any[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) // Last 12 months
        }
      },
      orderBy: { date: 'asc' }
    });

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = transaction.date.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, count: 0, value: 0 };
      }
      acc[month].count += 1;
      acc[month].value += transaction.totalAmount;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData);
  }

  private async getWarehouseTurnoverRate(warehouseId: string): Promise<number> {
    // Simplified calculation
    return Math.random() * 12; // Placeholder
  }

  private async getWarehouseEfficiency(warehouseId: string): Promise<number> {
    // Simplified calculation
    return Math.random() * 100; // Placeholder
  }

  private async getWarehouseRecentActivity(warehouseId: string, limit: number): Promise<any[]> {
    return await prisma.transaction.findMany({
      where: { warehouseId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true } },
        user: { select: { fullName: true } }
      }
    });
  }

  private async getTotalRevenue(dateFilter: any): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: {
        ...dateFilter,
        type: 'SALE'
      },
      _sum: { totalAmount: true }
    });

    return result._sum.totalAmount || 0;
  }

  private async getTotalCosts(dateFilter: any): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: {
        ...dateFilter,
        type: 'PURCHASE'
      },
      _sum: { totalAmount: true }
    });

    return result._sum.totalAmount || 0;
  }

  private async getMonthlyRevenue(dateFilter: any): Promise<any[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        ...dateFilter,
        type: 'SALE'
      },
      orderBy: { date: 'asc' }
    });

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = transaction.date.toISOString().substring(0, 7);
      if (!acc[month]) {
        acc[month] = { month, revenue: 0 };
      }
      acc[month].revenue += transaction.totalAmount;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData);
  }

  private async getMonthlyCosts(dateFilter: any): Promise<any[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        ...dateFilter,
        type: 'PURCHASE'
      },
      orderBy: { date: 'asc' }
    });

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = transaction.date.toISOString().substring(0, 7);
      if (!acc[month]) {
        acc[month] = { month, costs: 0 };
      }
      acc[month].costs += transaction.totalAmount;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData);
  }

  private async getTopSellingProducts(dateFilter: any, limit: number): Promise<any[]> {
    const result = await prisma.transaction.groupBy({
      by: ['productId', 'productName'],
      where: {
        ...dateFilter,
        type: 'SALE'
      },
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: limit
    });

    return result.map(item => ({
      productId: item.productId,
      productName: item.productName,
      revenue: item._sum.totalAmount
    }));
  }

  private async getSupplierCosts(dateFilter: any): Promise<any[]> {
    const result = await prisma.transaction.groupBy({
      by: ['supplierId', 'supplierName'],
      where: {
        ...dateFilter,
        type: 'PURCHASE'
      },
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: 'desc' } }
    });

    return result.map(item => ({
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      costs: item._sum.totalAmount
    }));
  }

  private async getCategoryRevenue(dateFilter: any): Promise<any[]> {
    // This would require joining with products table
    // Simplified implementation
    return [];
  }

  private async getProfitTrends(dateFilter: any): Promise<any[]> {
    const revenue = await this.getMonthlyRevenue(dateFilter);
    const costs = await this.getMonthlyCosts(dateFilter);

    const profitTrends = revenue.map(rev => {
      const cost = costs.find(c => c.month === rev.month);
      return {
        month: rev.month,
        revenue: rev.revenue,
        costs: cost?.costs || 0,
        profit: rev.revenue - (cost?.costs || 0)
      };
    });

    return profitTrends;
  }

  private async getAverageInventory(warehouseId?: string): Promise<number> {
    const whereClause = warehouseId ? { warehouseId } : {};
    
    const result = await prisma.inventory.aggregate({
      where: whereClause,
      _avg: { quantity: true }
    });

    return result._avg.quantity || 0;
  }
}

export default new AnalyticsService();
