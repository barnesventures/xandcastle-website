// Type definitions for database models
// These extend the Prisma generated types with utility types

import { Product, BlogPost, Order, User } from '@prisma/client'

// Product variant type from JSON field
export interface ProductVariant {
  id: string
  printifyId: string
  title: string
  price: number
  options: {
    size?: string
    color?: string
    [key: string]: string | undefined
  }
  isEnabled: boolean
  isAvailable: boolean
}

// Product option type from JSON field
export interface ProductOption {
  name: string
  type: string
  values: Array<{
    id: number
    title: string
  }>
}

// Product image type from JSON field
export interface ProductImage {
  src: string
  position: string
  isDefault: boolean
  variantIds: string[]
}

// Order item type from JSON field
export interface OrderItem {
  productId: string
  variantId: string
  printifyProductId: string
  printifyVariantId: string
  title: string
  variantTitle: string
  quantity: number
  price: number
  image?: string
}

// Address type for orders
export interface Address {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  address1: string
  address2?: string
  city: string
  region: string
  country: string
  zip: string
}

// Extended types with parsed JSON fields
export interface ProductWithParsedFields extends Omit<Product, 'options' | 'variants' | 'images'> {
  options: ProductOption[]
  variants: ProductVariant[]
  images: ProductImage[]
}

export interface OrderWithParsedFields extends Omit<Order, 'items' | 'shippingAddress' | 'billingAddress'> {
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address | null
}

// Utility type for public product data (without internal fields)
export type PublicProduct = Omit<ProductWithParsedFields, 'createdAt' | 'updatedAt' | 'lastSyncedAt'>

// Utility type for public blog post data
export type PublicBlogPost = Omit<BlogPost, 'createdAt' | 'updatedAt'>

// Utility type for public order data (for customer viewing)
export type PublicOrder = Omit<OrderWithParsedFields, 'stripePaymentId' | 'printifyOrderId'>