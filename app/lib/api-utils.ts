import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, options?: { headers?: Record<string, string> }): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    } as ApiResponse<T>,
    { headers: options?.headers }
  );
}

export function errorResponse(
  error: string,
  message?: string,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    } as ApiResponse,
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('not found')) {
      return errorResponse('Not found', error.message, 404);
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      return errorResponse('Unauthorized', error.message, 401);
    }
    
    if (error.message.includes('invalid') || error.message.includes('required')) {
      return errorResponse('Bad request', error.message, 400);
    }
    
    return errorResponse('Internal server error', error.message, 500);
  }
  
  return errorResponse('Internal server error', 'An unexpected error occurred', 500);
}

export const apiCacheHeaders = {
  products: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
  productDetails: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
  shipping: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  },
};