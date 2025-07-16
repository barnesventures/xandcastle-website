// Client-side helper functions for Printify API

export interface ProductListItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: Array<{ src: string; position: string }>;
  variant_count: number;
}

export interface ProductDetails {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: Array<{
    src: string;
    variant_ids: number[];
    position: string;
    is_default: boolean;
  }>;
  variants: Array<{
    id: number;
    title: string;
    price: number;
    is_available: boolean;
    is_enabled: boolean;
    options: {
      color: string;
      size: string;
    };
  }>;
  price_range: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface OrderData {
  line_items: Array<{
    product_id: string;
    variant_id: number;
    quantity: number;
  }>;
  shipping_method?: 1 | 2;
  address_to: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    country: string;
    region?: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
  auto_submit?: boolean;
}

export interface ShippingRates {
  standard: {
    method: 1;
    name: string;
    price: number;
    estimated_delivery: string;
  };
  express?: {
    method: 2;
    name: string;
    price: number;
    estimated_delivery: string;
  };
  currency: string;
}

class PrintifyClient {
  private baseUrl = '/api/printify';

  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data.data;
  }

  /**
   * Fetch all products, optionally filtered by tag
   */
  async getProducts(tag?: string): Promise<ProductListItem[]> {
    const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
    return this.fetchAPI<ProductListItem[]>(`/products${query}`);
  }

  /**
   * Get detailed information about a specific product
   */
  async getProductDetails(productId: string): Promise<ProductDetails> {
    return this.fetchAPI<ProductDetails>(`/products/${productId}`);
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: OrderData): Promise<{
    id: string;
    external_id: string;
    status: string;
    total_price: number;
    total_shipping: number;
    total_tax: number;
  }> {
    return this.fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<{
    id: string;
    status: string;
    fulfillment_status: string;
    shipments: Array<{
      carrier: string;
      number: string;
      url: string;
      delivered_at?: string;
    }>;
  }> {
    return this.fetchAPI(`/orders?id=${orderId}`);
  }

  /**
   * Calculate shipping rates
   */
  async calculateShipping(
    lineItems: OrderData['line_items'],
    addressTo: Pick<OrderData['address_to'], 'country' | 'region' | 'zip'>
  ): Promise<ShippingRates> {
    return this.fetchAPI('/shipping', {
      method: 'POST',
      body: JSON.stringify({ line_items: lineItems, address_to: addressTo }),
    });
  }

  /**
   * Convert price from cents to formatted string
   */
  formatPrice(priceInCents: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(priceInCents / 100);
  }

  /**
   * Get products for Windsor tourist collection
   */
  async getWindsorTouristProducts(): Promise<ProductListItem[]> {
    return this.getProducts('windsor-tourist');
  }
}

// Export singleton instance
export const printifyClient = new PrintifyClient();

// Export convenience functions
export const getProducts = (tag?: string) => printifyClient.getProducts(tag);
export const getProductDetails = (productId: string) => printifyClient.getProductDetails(productId);
export const createOrder = (orderData: OrderData) => printifyClient.createOrder(orderData);
export const getOrderStatus = (orderId: string) => printifyClient.getOrderStatus(orderId);
export const calculateShipping = (
  lineItems: OrderData['line_items'],
  addressTo: Pick<OrderData['address_to'], 'country' | 'region' | 'zip'>
) => printifyClient.calculateShipping(lineItems, addressTo);
export const formatPrice = (priceInCents: number, currency?: string) => 
  printifyClient.formatPrice(priceInCents, currency);
export const getWindsorTouristProducts = () => printifyClient.getWindsorTouristProducts();