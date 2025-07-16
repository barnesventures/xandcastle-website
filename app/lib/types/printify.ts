// Printify API Type Definitions

export interface PrintifyError {
  code: string;
  message: string;
}

export interface PrintifyImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

export interface PrintifyVariant {
  id: number;
  title: string;
  options: {
    color: string;
    size: string;
  };
  placeholders: Array<{
    position: string;
    images: Array<{
      id: string;
      name: string;
      type: string;
      height: number;
      width: number;
      x: number;
      y: number;
      scale: number;
      angle: number;
    }>;
  }>;
}

export interface PrintifyVariantWithPrice extends PrintifyVariant {
  price: number; // Price in cents (USD)
  is_enabled: boolean;
  is_default: boolean;
  is_available: boolean;
  options: {
    color: string;
    size: string;
  };
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  variants: number; // Number of variants
  images: PrintifyImage[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  published: boolean;
}

export interface PrintifyProductDetails extends PrintifyProduct {
  variants: PrintifyVariantWithPrice[]; // Full variant details
  print_provider_id: number;
  blueprint_id: number;
  shop_id: number;
  print_areas: Array<{
    variant_ids: number[];
    placeholders: Array<{
      position: string;
      images: Array<{
        id: string;
        x: number;
        y: number;
        scale: number;
        angle: number;
      }>;
    }>;
    background: string;
  }>;
  sales_channel_properties: Array<{
    channel: string;
    is_enabled: boolean;
  }>;
}

export interface PrintifyAddress {
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
}

export interface PrintifyLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
  print_provider_id?: number;
  blueprint_id?: number;
  print_areas?: {
    front?: string;
    back?: string;
  };
}

export interface CreateOrderRequest {
  external_id?: string;
  line_items: PrintifyLineItem[];
  shipping_method: 1 | 2; // 1 = standard, 2 = express
  send_shipping_notification?: boolean;
  address_to: PrintifyAddress;
}

export interface CreateOrderResponse {
  id: string;
  external_id: string;
  status: string;
  shipping_method: number;
  created_at: string;
  line_items: Array<{
    id: string;
    product_id: string;
    variant_id: number;
    quantity: number;
    status: string;
    metadata: {
      title: string;
      price: number;
      variant_label: string;
    };
  }>;
  address_to: PrintifyAddress;
  total_price: number;
  total_shipping: number;
  total_tax: number;
}

export interface PrintifyShipment {
  carrier: string;
  number: string;
  url: string;
  delivered_at?: string;
}

export interface PrintifyOrder {
  id: string;
  external_id: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled' | 'on-hold' | 'partially-fulfilled';
  fulfillment_status: 'pending' | 'fulfilled' | 'partially-fulfilled' | 'unfulfilled';
  shipping_method: number;
  shipments?: PrintifyShipment[];
  created_at: string;
  updated_at: string;
  sent_to_production_at?: string;
  fulfilled_at?: string;
  line_items: Array<{
    id: string;
    product_id: string;
    variant_id: number;
    quantity: number;
    status: string;
    metadata: {
      title: string;
      price: number;
      variant_label: string;
      sku?: string;
    };
  }>;
  address_to: PrintifyAddress;
  total_price: number;
  total_shipping: number;
  total_tax: number;
}

export interface PrintifyOrderStatus {
  id: string;
  status: string;
  fulfillment_status: string;
  shipments: PrintifyShipment[];
  created_at: string;
  updated_at: string;
}