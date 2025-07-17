import { prisma } from './prisma';
import { printifyAPI } from './printify';
import { inventorySyncService } from './inventory-sync';
import { ProductInventory, StockStatus, VariantInventory } from './types/inventory';
import { PrintifyProductDetails } from './types/printify';

export interface ProductWithInventory {
  id: string;
  printifyId: string;
  title: string;
  description: string | null;
  tags: string[];
  options: any;
  variants: any;
  images: any;
  isWindsorProduct: boolean;
  inventory?: ProductInventory;
  stockStatus?: StockStatus;
}

export interface VariantWithStock {
  id: number;
  title: string;
  price: number;
  is_available: boolean;
  is_enabled: boolean;
  options: {
    color: string;
    size: string;
  };
  inStock?: boolean;
  stockStatus?: 'in_stock' | 'out_of_stock';
}

export class ProductService {
  /**
   * Get product with inventory data
   */
  async getProductWithInventory(productId: string): Promise<ProductWithInventory | null> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        printifyId: true,
        title: true,
        description: true,
        tags: true,
        options: true,
        variants: true,
        images: true,
        isWindsorProduct: true,
        inventoryData: true,
        lastInventorySync: true
      }
    });

    if (!product) {
      return null;
    }

    // If inventory hasn't been synced in the last 6 hours, sync it
    const shouldSync = !product.lastInventorySync || 
      product.lastInventorySync < new Date(Date.now() - 6 * 60 * 60 * 1000);

    if (shouldSync) {
      try {
        await inventorySyncService.syncProductInventory(product.id, product.printifyId);
        
        // Re-fetch with updated inventory
        const updatedProduct = await prisma.product.findUnique({
          where: { id: productId },
          select: { inventoryData: true }
        });
        
        if (updatedProduct?.inventoryData) {
          product.inventoryData = updatedProduct.inventoryData;
        }
      } catch (error) {
        console.error('Failed to sync inventory:', error);
      }
    }

    const inventory = product.inventoryData as ProductInventory | null;
    const stockStatus = inventory ? inventorySyncService.getStockStatus(inventory) : undefined;

    return {
      ...product,
      inventory: inventory || undefined,
      stockStatus
    };
  }

  /**
   * Get product details with inventory for client
   */
  async getProductDetailsWithInventory(productId: string): Promise<any> {
    const product = await this.getProductWithInventory(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Enhance variants with stock information
    const variants = product.variants as any[];
    const enhancedVariants = variants.map(variant => {
      const stockInfo = product.inventory?.variants[variant.id];
      
      return {
        ...variant,
        inStock: stockInfo?.isAvailable ?? variant.is_available,
        stockStatus: stockInfo?.isAvailable ? 'in_stock' : 'out_of_stock'
      };
    });

    return {
      id: product.printifyId, // Client expects printify ID as id
      title: product.title,
      description: product.description,
      tags: product.tags,
      images: product.images,
      variants: enhancedVariants,
      price_range: this.calculatePriceRange(enhancedVariants),
      stockStatus: product.stockStatus,
      inventory: {
        totalInStock: product.inventory?.totalInStock || 0,
        totalVariants: product.inventory?.totalVariants || variants.length,
        lastChecked: product.inventory?.lastSyncedAt
      }
    };
  }

  /**
   * Calculate price range from variants
   */
  private calculatePriceRange(variants: any[]): { min: number; max: number; currency: string } {
    const availableVariants = variants.filter(v => v.is_enabled && v.inStock);
    
    if (availableVariants.length === 0) {
      return { min: 0, max: 0, currency: 'USD' };
    }

    const prices = availableVariants.map(v => v.price);
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency: 'USD'
    };
  }

  /**
   * Check if specific variants are in stock
   */
  async checkVariantsStock(productId: string, variantIds: number[]): Promise<Record<number, boolean>> {
    const product = await this.getProductWithInventory(productId);
    
    if (!product || !product.inventory) {
      return {};
    }

    const stockStatus: Record<number, boolean> = {};
    
    for (const variantId of variantIds) {
      const variantInventory = product.inventory.variants[variantId];
      stockStatus[variantId] = variantInventory?.isAvailable || false;
    }

    return stockStatus;
  }

  /**
   * Get all products with inventory summary
   */
  async getProductsWithInventory(tag?: string) {
    const products = await prisma.product.findMany({
      where: {
        isVisible: true,
        ...(tag ? { tags: { has: tag } } : {})
      },
      select: {
        id: true,
        printifyId: true,
        title: true,
        tags: true,
        images: true,
        variants: true,
        inventoryData: true,
        isWindsorProduct: true
      }
    });

    return products.map(product => {
      const inventory = product.inventoryData as ProductInventory | null;
      const stockStatus = inventory ? inventorySyncService.getStockStatus(inventory) : StockStatus.IN_STOCK;
      
      // Extract first image for listing
      const images = product.images as any[];
      const mainImage = images.find(img => img.position === 'front') || images[0];

      // Calculate variant count
      const variants = product.variants as any[];
      const variant_count = variants.length;

      return {
        id: product.printifyId,
        title: product.title,
        tags: product.tags,
        images: images.map(img => ({ src: img.src, position: img.position })),
        variant_count,
        stockStatus,
        inStockVariants: inventory?.totalInStock || variant_count,
        isWindsorProduct: product.isWindsorProduct
      };
    });
  }
}

// Export singleton instance
export const productService = new ProductService();