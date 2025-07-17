'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductDetails } from '@/app/lib/printify-client';
import * as gtag from '@/app/utils/analytics';
import { useCurrency } from './CurrencyContext';

export interface CartItem {
  id: string; // Combination of productId and variantId
  productId: string;
  variantId: number;
  title: string;
  variantTitle: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: ProductDetails, variantId: number, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'xandcastle_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentCurrency } = useCurrency();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: ProductDetails, variantId: number, quantity = 1) => {
    const variant = product.variants.find(v => v.id === variantId);
    
    if (!variant || !variant.is_available || !variant.is_enabled) {
      throw new Error('Selected variant is not available');
    }

    const itemId = `${product.id}-${variantId}`;
    const existingItem = items.find(item => item.id === itemId);

    if (existingItem) {
      // Update quantity if item already exists
      updateQuantity(itemId, existingItem.quantity + quantity);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        variantId: variantId,
        title: product.title,
        variantTitle: variant.title,
        price: variant.price,
        quantity: quantity,
        image: product.images.find(img => img.is_default || img.variant_ids.includes(variantId))?.src || product.images[0]?.src,
        color: variant.options.color,
        size: variant.options.size,
      };

      setItems([...items, newItem]);
      
      // Track add to cart event
      gtag.addToCart({
        currency: currentCurrency,
        value: variant.price / 100, // Convert cents to currency units
        items: [{
          item_id: product.id,
          item_name: product.title,
          item_category: 'Apparel',
          item_variant: variant.title,
          price: variant.price / 100,
          quantity: quantity
        }]
      });
    }

    // Open cart drawer when item is added
    setIsOpen(true);
  };

  const removeItem = (itemId: string) => {
    const itemToRemove = items.find(item => item.id === itemId);
    if (itemToRemove) {
      // Track remove from cart event
      gtag.removeFromCart({
        currency: currentCurrency,
        value: itemToRemove.price / 100 * itemToRemove.quantity,
        items: [{
          item_id: itemToRemove.productId,
          item_name: itemToRemove.title,
          item_category: 'Apparel',
          item_variant: itemToRemove.variantTitle,
          price: itemToRemove.price / 100,
          quantity: itemToRemove.quantity
        }]
      });
    }
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}