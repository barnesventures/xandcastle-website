import { prisma } from './prisma';
import { printifyAPI } from './printify';
import { 
  ProductInventory, 
  VariantInventory, 
  InventorySyncResult,
  StockStatus 
} from './types/inventory';
import { PrintifyProductDetails } from './types/printify';
import { sendRestockNotificationEmail } from './email';

export class InventorySyncService {
  /**
   * Sync inventory for all products
   */
  async syncAllProducts(): Promise<InventorySyncResult> {
    const result: InventorySyncResult = {
      success: true,
      productsUpdated: 0,
      variantsChecked: 0,
      restockDetected: [],
      errors: []
    };

    try {
      // Get all products from database
      const products = await prisma.product.findMany({
        where: { isVisible: true },
        select: {
          id: true,
          printifyId: true,
          title: true,
          inventoryData: true,
          lastInventorySync: true
        }
      });

      console.log(`Starting inventory sync for ${products.length} products`);

      // Sync each product
      for (const product of products) {
        try {
          const syncResult = await this.syncProductInventory(product.id, product.printifyId);
          
          if (syncResult.updated) {
            result.productsUpdated++;
          }
          
          result.variantsChecked += syncResult.variantsChecked;
          result.restockDetected.push(...syncResult.restockDetected);
          
        } catch (error) {
          const errorMsg = `Failed to sync product ${product.printifyId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(errorMsg);
          result.errors = result.errors || [];
          result.errors.push(errorMsg);
        }
      }

      // Process restock notifications if any items came back in stock
      if (result.restockDetected.length > 0) {
        await this.processRestockNotifications(result.restockDetected);
      }

      console.log(`Inventory sync completed: ${result.productsUpdated} products updated, ${result.variantsChecked} variants checked`);
      
    } catch (error) {
      console.error('Inventory sync failed:', error);
      result.success = false;
      result.errors = result.errors || [];
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return result;
  }

  /**
   * Sync inventory for a single product
   */
  async syncProductInventory(productId: string, printifyId: string): Promise<{
    updated: boolean;
    variantsChecked: number;
    restockDetected: Array<{ productId: string; variantId: number; variantTitle: string }>;
  }> {
    // Fetch latest product details from Printify
    const productDetails = await printifyAPI.getProductDetails(printifyId);
    
    // Get current inventory data from database
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { inventoryData: true }
    });

    const currentInventory = currentProduct?.inventoryData as ProductInventory | null;
    
    // Build new inventory data
    const newInventory: ProductInventory = {
      productId: printifyId,
      variants: {},
      lastSyncedAt: new Date().toISOString(),
      totalInStock: 0,
      totalVariants: productDetails.variants.length
    };

    const restockDetected: Array<{ productId: string; variantId: number; variantTitle: string }> = [];

    // Check each variant
    for (const variant of productDetails.variants) {
      const variantInventory: VariantInventory = {
        variantId: variant.id,
        isAvailable: variant.is_available && variant.is_enabled,
        lastChecked: new Date().toISOString(),
        quantity: variant.quantity
      };

      newInventory.variants[variant.id] = variantInventory;

      if (variantInventory.isAvailable) {
        newInventory.totalInStock++;
      }

      // Check if this variant came back in stock
      const wasOutOfStock = currentInventory?.variants[variant.id]?.isAvailable === false;
      if (wasOutOfStock && variantInventory.isAvailable) {
        restockDetected.push({
          productId,
          variantId: variant.id,
          variantTitle: variant.title
        });
      }
    }

    // Update database if inventory changed
    const inventoryChanged = JSON.stringify(currentInventory) !== JSON.stringify(newInventory);
    
    if (inventoryChanged) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          inventoryData: newInventory,
          lastInventorySync: new Date()
        }
      });
    }

    return {
      updated: inventoryChanged,
      variantsChecked: productDetails.variants.length,
      restockDetected
    };
  }

  /**
   * Get stock status for a product
   */
  getStockStatus(inventory: ProductInventory): StockStatus {
    if (inventory.totalInStock === 0) {
      return StockStatus.OUT_OF_STOCK;
    }

    const availabilityRatio = inventory.totalInStock / inventory.totalVariants;
    
    if (availabilityRatio < 0.3) {
      return StockStatus.LOW_STOCK;
    }

    return StockStatus.IN_STOCK;
  }

  /**
   * Check if a specific variant is in stock
   */
  async isVariantInStock(productId: string, variantId: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { inventoryData: true }
    });

    if (!product?.inventoryData) {
      // If no inventory data, fetch it
      const printifyProduct = await prisma.product.findUnique({
        where: { id: productId },
        select: { printifyId: true }
      });

      if (printifyProduct) {
        await this.syncProductInventory(productId, printifyProduct.printifyId);
        
        // Re-fetch after sync
        const updatedProduct = await prisma.product.findUnique({
          where: { id: productId },
          select: { inventoryData: true }
        });

        const inventory = updatedProduct?.inventoryData as ProductInventory | null;
        return inventory?.variants[variantId]?.isAvailable || false;
      }
    }

    const inventory = product.inventoryData as ProductInventory | null;
    return inventory?.variants[variantId]?.isAvailable || false;
  }

  /**
   * Process restock notifications
   */
  private async processRestockNotifications(restockedItems: Array<{
    productId: string;
    variantId: number;
    variantTitle: string;
  }>) {
    for (const item of restockedItems) {
      // Find all pending notifications for this variant
      const notifications = await prisma.restockNotification.findMany({
        where: {
          productId: item.productId,
          variantId: item.variantId,
          notified: false
        },
        include: {
          product: {
            select: {
              title: true,
              printifyId: true
            }
          }
        }
      });

      if (notifications.length > 0) {
        console.log(`Processing ${notifications.length} restock notifications for variant ${item.variantId}`);
        
        // Send email notifications
        for (const notification of notifications) {
          try {
            await sendRestockNotificationEmail({
              email: notification.email,
              productTitle: notification.product.title,
              variantTitle: notification.variantTitle,
              productId: notification.product.printifyId,
            });

            // Mark as notified
            await prisma.restockNotification.update({
              where: { id: notification.id },
              data: {
                notified: true,
                notifiedAt: new Date()
              }
            });

            console.log(`Sent restock notification to ${notification.email}`);
          } catch (error) {
            console.error(`Failed to send restock notification to ${notification.email}:`, error);
            // Continue with other notifications even if one fails
          }
        }
      }
    }
  }

  /**
   * Get inventory summary for admin dashboard
   */
  async getInventorySummary() {
    const products = await prisma.product.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        title: true,
        inventoryData: true,
        lastInventorySync: true,
        isWindsorProduct: true
      }
    });

    const summary = {
      totalProducts: products.length,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      neverSynced: 0,
      lastSyncedProducts: [] as Array<{
        id: string;
        title: string;
        stockStatus: StockStatus;
        lastSync: Date | null;
      }>
    };

    for (const product of products) {
      if (!product.inventoryData || !product.lastInventorySync) {
        summary.neverSynced++;
        continue;
      }

      const inventory = product.inventoryData as ProductInventory;
      const status = this.getStockStatus(inventory);

      switch (status) {
        case StockStatus.IN_STOCK:
          summary.inStock++;
          break;
        case StockStatus.LOW_STOCK:
          summary.lowStock++;
          break;
        case StockStatus.OUT_OF_STOCK:
          summary.outOfStock++;
          break;
      }

      summary.lastSyncedProducts.push({
        id: product.id,
        title: product.title,
        stockStatus: status,
        lastSync: product.lastInventorySync
      });
    }

    // Sort by last sync date, most recent first
    summary.lastSyncedProducts.sort((a, b) => {
      if (!a.lastSync) return 1;
      if (!b.lastSync) return -1;
      return b.lastSync.getTime() - a.lastSync.getTime();
    });

    return summary;
  }
}

// Export singleton instance
export const inventorySyncService = new InventorySyncService();