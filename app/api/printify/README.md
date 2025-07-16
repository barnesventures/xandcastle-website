# Printify API Endpoints

This directory contains the API endpoints for integrating with Printify's print-on-demand service.

## Environment Variables

Required environment variables:
- `PRINTIFY_API_KEY`: Your Printify API key
- `PRINTIFY_SHOP_ID`: Your Printify shop ID

## Endpoints

### GET /api/printify/products

Fetch all published products from the catalog.

**Query Parameters:**
- `tag` (optional): Filter products by tag (e.g., "windsor-tourist")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product_id",
      "title": "Product Name",
      "description": "Product description",
      "tags": ["tag1", "tag2"],
      "images": [{ "src": "image_url", "position": "front" }],
      "variant_count": 12,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 10
}
```

### GET /api/printify/products/[id]

Get detailed information about a specific product including all variants and pricing.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "title": "Product Name",
    "description": "Product description",
    "tags": ["tag1", "tag2"],
    "images": [...],
    "variants": [
      {
        "id": 123,
        "title": "S / Black",
        "price": 2499, // Price in cents (USD)
        "is_available": true,
        "is_enabled": true,
        "options": {
          "color": "Black",
          "size": "S"
        }
      }
    ],
    "price_range": {
      "min": 2499,
      "max": 3499,
      "currency": "USD"
    }
  }
}
```

### POST /api/printify/orders

Create a new order.

**Request Body:**
```json
{
  "external_id": "optional_external_id",
  "line_items": [
    {
      "product_id": "product_id",
      "variant_id": 123,
      "quantity": 1
    }
  ],
  "shipping_method": 1, // 1 = standard, 2 = express
  "send_shipping_notification": true,
  "address_to": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "US",
    "region": "CA",
    "address1": "123 Main St",
    "address2": "Apt 4",
    "city": "Los Angeles",
    "zip": "90001"
  },
  "auto_submit": false // Set to true to submit for fulfillment immediately
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "external_id": "external_id",
    "status": "pending",
    "line_items": [...],
    "total_price": 3499, // In cents
    "total_shipping": 599, // In cents
    "total_tax": 0, // In cents
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/printify/orders?id=[order_id]

Get the status of an order.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "status": "fulfilled",
    "fulfillment_status": "fulfilled",
    "shipments": [
      {
        "carrier": "USPS",
        "number": "tracking_number",
        "url": "tracking_url",
        "delivered_at": "2024-01-10T00:00:00Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
}
```

### POST /api/printify/shipping

Calculate shipping rates for an order.

**Request Body:**
```json
{
  "line_items": [
    {
      "product_id": "product_id",
      "variant_id": 123,
      "quantity": 1
    }
  ],
  "address_to": {
    "country": "US",
    "region": "CA", // Optional
    "zip": "90001" // Optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "standard": {
      "method": 1,
      "name": "Standard Shipping",
      "price": 599, // In cents (USD)
      "estimated_delivery": "7-14 business days"
    },
    "express": {
      "method": 2,
      "name": "Express Shipping",
      "price": 1299, // In cents (USD)
      "estimated_delivery": "3-5 business days"
    },
    "currency": "USD"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid API key)
- 404: Not Found (product/order not found)
- 500: Internal Server Error

## Notes

- All prices are returned in cents (USD)
- Currency conversion should be handled client-side
- Products are cached for 5 minutes to improve performance
- Only published products are returned by the catalog endpoint