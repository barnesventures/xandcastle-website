// Google Analytics 4 Event Types and Parameters
export interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// E-commerce specific event types for GA4
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  affiliation?: string;
  coupon?: string;
  currency?: string;
  discount?: number;
  index?: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_list_id?: string;
  item_list_name?: string;
  item_variant?: string;
  location_id?: string;
  price?: number;
  quantity?: number;
}

export interface EcommerceEventData {
  currency?: string;
  value?: number;
  items?: EcommerceItem[];
  coupon?: string;
  shipping?: number;
  tax?: number;
  transaction_id?: string;
  affiliation?: string;
  [key: string]: any;
}

// Check if we're in production and have consent
export const canTrack = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (process.env.NODE_ENV !== 'production') return false;
  
  // Check for analytics consent from cookie
  const consentCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('xandcastle-cookie-consent='));
  
  if (consentCookie) {
    try {
      const consentData = JSON.parse(decodeURIComponent(consentCookie.split('=')[1]));
      return consentData.analytics === true;
    } catch {
      return false;
    }
  }
  
  return false;
};

// Send page view
export const pageview = (url: string): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Send custom event
export const event = ({ action, category, label, value, ...otherParams }: GAEvent): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...otherParams,
  });
};

// E-commerce Events

// When a user views a list of items
export const viewItemList = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'view_item_list', data);
};

// When a user views item details
export const viewItem = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'view_item', data);
};

// When a user adds an item to cart
export const addToCart = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'add_to_cart', data);
};

// When a user removes an item from cart
export const removeFromCart = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'remove_from_cart', data);
};

// When a user views the cart
export const viewCart = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'view_cart', data);
};

// When a user begins checkout
export const beginCheckout = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'begin_checkout', data);
};

// When a user adds payment information
export const addPaymentInfo = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'add_payment_info', data);
};

// When a user adds shipping information
export const addShippingInfo = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'add_shipping_info', data);
};

// When a user completes a purchase
export const purchase = (data: EcommerceEventData): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'purchase', data);
};

// When a user signs up for newsletter
export const signUp = (method: string): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'sign_up', {
    method: method,
  });
};

// When a user searches
export const search = (searchTerm: string): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'search', {
    search_term: searchTerm,
  });
};

// When a user shares content
export const share = (method: string, contentType: string, itemId?: string): void => {
  if (!canTrack() || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
  });
};