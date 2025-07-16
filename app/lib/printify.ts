import { 
  PrintifyProduct, 
  PrintifyProductDetails, 
  PrintifyVariant,
  PrintifyOrder,
  PrintifyOrderStatus,
  PrintifyError,
  CreateOrderRequest,
  CreateOrderResponse 
} from './types/printify';

const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

class PrintifyAPI {
  private apiKey: string;
  private shopId: string;

  constructor() {
    const apiKey = process.env.PRINTIFY_API_KEY;
    const shopId = process.env.PRINTIFY_SHOP_ID;
    
    if (!apiKey) {
      throw new Error('PRINTIFY_API_KEY environment variable is required');
    }
    
    if (!shopId) {
      throw new Error('PRINTIFY_SHOP_ID environment variable is required');
    }
    
    this.apiKey = apiKey;
    this.shopId = shopId;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${PRINTIFY_API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error: PrintifyError = await response.json();
        throw new Error(`Printify API error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Printify API request failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all products from the catalog
   */
  async fetchProductCatalog(): Promise<PrintifyProduct[]> {
    try {
      const response = await this.makeRequest<{ data: PrintifyProduct[] }>(
        `/shops/${this.shopId}/products.json`
      );
      
      // Filter out unpublished products
      return response.data.filter(product => product.published);
    } catch (error) {
      console.error('Failed to fetch product catalog:', error);
      throw new Error('Unable to fetch products at this time');
    }
  }

  /**
   * Get detailed product information including all variants
   */
  async getProductDetails(productId: string): Promise<PrintifyProductDetails> {
    try {
      const product = await this.makeRequest<PrintifyProductDetails>(
        `/shops/${this.shopId}/products/${productId}.json`
      );
      
      if (!product.published) {
        throw new Error('Product not found or not published');
      }
      
      return product;
    } catch (error) {
      console.error(`Failed to fetch product details for ${productId}:`, error);
      throw new Error('Unable to fetch product details');
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      // Validate order data
      if (!orderData.line_items || orderData.line_items.length === 0) {
        throw new Error('Order must contain at least one line item');
      }

      if (!orderData.address_to) {
        throw new Error('Shipping address is required');
      }

      const response = await this.makeRequest<CreateOrderResponse>(
        `/shops/${this.shopId}/orders.json`,
        {
          method: 'POST',
          body: JSON.stringify({
            ...orderData,
            external_id: orderData.external_id || `order_${Date.now()}`,
          }),
        }
      );

      console.log('Order created successfully:', response.id);
      return response;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Unable to create order at this time');
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<PrintifyOrderStatus> {
    try {
      const order = await this.makeRequest<PrintifyOrder>(
        `/shops/${this.shopId}/orders/${orderId}.json`
      );
      
      return {
        id: order.id,
        status: order.status,
        fulfillment_status: order.fulfillment_status,
        shipments: order.shipments || [],
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
    } catch (error) {
      console.error(`Failed to fetch order status for ${orderId}:`, error);
      throw new Error('Unable to fetch order status');
    }
  }

  /**
   * Calculate shipping for an order
   */
  async calculateShipping(
    lineItems: Array<{ product_id: string; variant_id: number; quantity: number }>,
    addressTo: { country: string; region?: string; zip?: string }
  ): Promise<{ standard: number; express?: number }> {
    try {
      const response = await this.makeRequest<{ standard: number; express?: number }>(
        `/shops/${this.shopId}/orders/shipping.json`,
        {
          method: 'POST',
          body: JSON.stringify({
            line_items: lineItems,
            address_to: addressTo,
          }),
        }
      );
      
      return response;
    } catch (error) {
      console.error('Failed to calculate shipping:', error);
      // Return default shipping rates as fallback
      return { standard: 5.99 };
    }
  }

  /**
   * Submit an order for fulfillment
   */
  async submitOrderForFulfillment(orderId: string): Promise<void> {
    try {
      await this.makeRequest(
        `/shops/${this.shopId}/orders/${orderId}/send_to_production.json`,
        {
          method: 'POST',
        }
      );
      
      console.log(`Order ${orderId} submitted for fulfillment`);
    } catch (error) {
      console.error(`Failed to submit order ${orderId} for fulfillment:`, error);
      throw new Error('Unable to submit order for fulfillment');
    }
  }
}

// Export singleton instance
export const printifyAPI = new PrintifyAPI();

// Export convenience functions
export const fetchProductCatalog = () => printifyAPI.fetchProductCatalog();
export const getProductDetails = (productId: string) => printifyAPI.getProductDetails(productId);
export const createOrder = (orderData: CreateOrderRequest) => printifyAPI.createOrder(orderData);
export const getOrderStatus = (orderId: string) => printifyAPI.getOrderStatus(orderId);
export const calculateShipping = (
  lineItems: Array<{ product_id: string; variant_id: number; quantity: number }>,
  addressTo: { country: string; region?: string; zip?: string }
) => printifyAPI.calculateShipping(lineItems, addressTo);
export const submitOrderForFulfillment = (orderId: string) => printifyAPI.submitOrderForFulfillment(orderId);