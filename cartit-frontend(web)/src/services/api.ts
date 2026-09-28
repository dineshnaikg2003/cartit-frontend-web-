const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cartit-backend-gqg9.onrender.com';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('cartit_web_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'API Request failed');
    }

    return data.data !== undefined ? data.data : data;
  } catch (error) {
    console.warn(`[CartIT API] Error requesting ${endpoint}:`, error);
    throw error;
  }
}

// 1. AUTH API
export const authApi = {
  sendOtp: (phone: string) => 
    fetchApi('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, otp: string) => 
    fetchApi<{ token: string; user: any }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),
};

// 2. PRODUCTS API
export const productsApi = {
  getAll: () => fetchApi<any>('/api/products'),
  getByCategory: (categoryId: string | number) => fetchApi<any[]>(`/api/products/category/${categoryId}`),
  getById: (id: string | number) => fetchApi<any>(`/api/products/${id}`),
};

// 3. CATEGORIES API
export const categoriesApi = {
  getAll: () => fetchApi<any[]>('/api/categories'),
};

// 4. SERVER CART API
export const cartApi = {
  getMyCart: () => fetchApi<any>('/api/cart'),
  addToCart: (productId: number | string, quantity: number = 1) =>
    fetchApi<any>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: Number(productId), quantity }),
    }),
  increaseQuantity: (productId: number | string) =>
    fetchApi<any>(`/api/cart/${productId}/increase`, { method: 'PATCH' }),
  decreaseQuantity: (productId: number | string) =>
    fetchApi<any>(`/api/cart/${productId}/decrease`, { method: 'PATCH' }),
  updateQuantity: (productId: number | string, quantity: number) =>
    fetchApi<any>(`/api/cart/${productId}/quantity`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (productId: number | string) =>
    fetchApi<any>(`/api/cart/${productId}`, { method: 'DELETE' }),
  clearCart: () => fetchApi<any>('/api/cart', { method: 'DELETE' }),
};

// 5. COUPONS API
export const couponsApi = {
  validateCoupon: (code: string, orderAmount: number = 199) =>
    fetchApi<any>('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount }),
    }),
  getActiveCoupons: () => fetchApi<any[]>('/api/coupons/active'),
};

// 6. ADDRESS API
export const addressApi = {
  getMyAddresses: () => fetchApi<any[]>('/api/addresses'),
  createAddress: (addressData: any) =>
    fetchApi<any>('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),
};

// 7. CHECKOUT API
export const checkoutApi = {
  checkout: (checkoutData: { addressId: number | string; paymentMethod: string; couponCode?: string }) =>
    fetchApi<any>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),
};

// 8. ORDERS API
export const ordersApi = {
  getMyOrders: () => fetchApi<any[]>('/api/orders'),
  getOrder: (id: number | string) => fetchApi<any>(`/api/orders/${id}`),
  cancelOrder: (id: number | string) => fetchApi<any>(`/api/orders/${id}/cancel`, { method: 'PATCH' }),
  rateOrder: (id: number | string, rating: number, reviewComment?: string) =>
    fetchApi<any>(`/api/orders/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, reviewComment }),
    }),
  getOrderRoute: (id: number | string) => fetchApi<any>(`/api/orders/${id}/route`),
};
