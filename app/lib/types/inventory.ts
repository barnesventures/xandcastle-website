// Inventory-related type definitions

export interface VariantInventory {
  variantId: number;
  isAvailable: boolean;
  lastChecked: string; // ISO date string
  quantity?: number; // Optional, if Printify provides it
}

export interface ProductInventory {
  productId: string;
  variants: Record<number, VariantInventory>; // Keyed by variant ID
  lastSyncedAt: string; // ISO date string
  totalInStock: number; // Count of available variants
  totalVariants: number; // Total count of variants
}

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock', // Less than 30% of variants available
  OUT_OF_STOCK = 'out_of_stock',
}

export interface InventorySyncResult {
  success: boolean;
  productsUpdated: number;
  variantsChecked: number;
  restockDetected: Array<{
    productId: string;
    variantId: number;
    variantTitle: string;
  }>;
  errors?: string[];
}

export interface RestockNotificationRequest {
  email: string;
  productId: string;
  variantId: number;
  variantTitle: string;
}