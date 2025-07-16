import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { 
  fetchProductCatalog,
  getProductDetails,
  createOrder,
  getOrderStatus,
  calculateShipping
} from '../printify';

// Mock environment variables
beforeAll(() => {
  process.env.PRINTIFY_API_KEY = 'test-api-key';
  process.env.PRINTIFY_SHOP_ID = 'test-shop-id';
});

// Mock fetch
global.fetch = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe('Printify API', () => {
  describe('fetchProductCatalog', () => {
    it('should fetch and filter published products', async () => {
      const mockResponse = {
        data: [
          { id: '1', title: 'Product 1', published: true },
          { id: '2', title: 'Product 2', published: false },
          { id: '3', title: 'Product 3', published: true },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const products = await fetchProductCatalog();

      expect(products).toHaveLength(2);
      expect(products).toEqual([
        { id: '1', title: 'Product 1', published: true },
        { id: '3', title: 'Product 3', published: true },
      ]);
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'API Error' }),
      });

      await expect(fetchProductCatalog()).rejects.toThrow('Printify API error: API Error');
    });
  });

  describe('getProductDetails', () => {
    it('should fetch product details for published products', async () => {
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        published: true,
        variants: [
          { id: 1, price: 2499, is_enabled: true },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const product = await getProductDetails('1');

      expect(product).toEqual(mockProduct);
    });

    it('should throw error for unpublished products', async () => {
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        published: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      await expect(getProductDetails('1')).rejects.toThrow('Product not found or not published');
    });
  });

  describe('createOrder', () => {
    it('should create an order with valid data', async () => {
      const orderData = {
        line_items: [
          { product_id: '1', variant_id: 1, quantity: 1 },
        ],
        shipping_method: 1 as const,
        address_to: {
          first_name: 'John',
          last_name: 'Doe',
          country: 'US',
          address1: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
      };

      const mockResponse = {
        id: 'order-123',
        external_id: 'order_123456',
        status: 'pending',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const order = await createOrder(orderData);

      expect(order).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders.json'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('line_items'),
        })
      );
    });

    it('should validate order data', async () => {
      const invalidOrderData = {
        line_items: [],
        shipping_method: 1 as const,
        address_to: {
          first_name: 'John',
          last_name: 'Doe',
          country: 'US',
          address1: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
      };

      await expect(createOrder(invalidOrderData)).rejects.toThrow('Order must contain at least one line item');
    });
  });

  describe('calculateShipping', () => {
    it('should calculate shipping rates', async () => {
      const lineItems = [
        { product_id: '1', variant_id: 1, quantity: 1 },
      ];
      const addressTo = { country: 'US', zip: '10001' };

      const mockResponse = {
        standard: 5.99,
        express: 12.99,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const rates = await calculateShipping(lineItems, addressTo);

      expect(rates).toEqual(mockResponse);
    });

    it('should return default rates on error', async () => {
      const lineItems = [
        { product_id: '1', variant_id: 1, quantity: 1 },
      ];
      const addressTo = { country: 'US' };

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const rates = await calculateShipping(lineItems, addressTo);

      expect(rates).toEqual({ standard: 5.99 });
    });
  });
});