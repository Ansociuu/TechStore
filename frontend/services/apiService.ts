import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Tạo instance axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (email: string, password: string, name: string) => {
        const response = await apiClient.post('/auth/register', { email, password, name });
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    forgotPassword: async (email: string) => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const response = await apiClient.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },
};

// Product API
export const productAPI = {
    getAll: async (params: any = {}) => {
        const response = await apiClient.get('/products', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    create: async (productData: any) => {
        const response = await apiClient.post('/products', productData);
        return response.data;
    },

    update: async (id: number | string, productData: any) => {
        const response = await apiClient.put(`/products/${id}`, productData);
        return response.data;
    },

    delete: async (id: number | string) => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },
    addReview: async (id: number | string, rating: number, comment: string) => {
        const response = await apiClient.post(`/products/${id}/reviews`, { rating, comment });
        return response.data;
    },
};

// Cart API
export const cartAPI = {
    get: async () => {
        const response = await apiClient.get('/cart');
        return response.data;
    },
    addItem: async (productId: number, quantity: number = 1) => {
        const response = await apiClient.post('/cart/add', { productId, quantity });
        return response.data;
    },
    updateItem: async (itemId: number, quantity: number) => {
        const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
        return response.data;
    },
    removeItem: async (itemId: number) => {
        const response = await apiClient.delete(`/cart/items/${itemId}`);
        return response.data;
    },
    clear: async () => {
        const response = await apiClient.delete('/cart');
        return response.data;
    },
};

// Order API
export const orderAPI = {
    create: async (orderData: any) => {
        const response = await apiClient.post('/orders', orderData);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/orders');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await apiClient.put(`/orders/${id}/status`, { status });
        return response.data;
    },
    getAllAdmin: async () => {
        const response = await apiClient.get('/orders/admin/all');
        return response.data;
    },

    createMoMoUrl: async (orderId: number) => {
        const response = await apiClient.post(`/orders/${orderId}/create-momo-url`);
        return response.data;
    },

    getStatusLabel: (status: string) => {
        const labels: Record<string, string> = {
            'pending': 'Đang chờ',
            'paid': 'Đã thanh toán',
            'processing': 'Đang xử lý',
            'shipped': 'Đang giao hàng',
            'delivered': 'Đã giao',
            'cancelled': 'Đã hủy',
            'payment_failed': 'Thanh toán lỗi'
        };
        return labels[status] || status;
    }
};

// Notification API
export const notificationAPI = {
    getAll: async () => {
        const response = await apiClient.get('/notifications');
        return response.data;
    },
    markAsRead: async (id: string) => {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return response.data;
    },
    markAllAsRead: async () => {
        const response = await apiClient.patch('/notifications/read-all');
        return response.data;
    },
};

// User API
export const userAPI = {
    getProfile: async () => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },
    updateProfile: async (userData: any) => {
        const response = await apiClient.put('/users/profile', userData);
        return response.data;
    },
    addAddress: async (addressData: any) => {
        const response = await apiClient.post('/users/addresses', addressData);
        return response.data;
    },
    updateAddress: async (id: string, addressData: any) => {
        const response = await apiClient.put(`/users/addresses/${id}`, addressData);
        return response.data;
    },
    deleteAddress: async (id: string) => {
        const response = await apiClient.delete(`/users/addresses/${id}`);
        return response.data;
    },
    setDefaultAddress: async (id: string) => {
        const response = await apiClient.patch(`/users/addresses/${id}/default`);
        return response.data;
    }
};

// Admin API
export const adminAPI = {
    getStats: async () => {
        const response = await apiClient.get('/admin/stats');
        return response.data;
    },
    getUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data;
    },
    updateUserRole: async (id: number, role: string) => {
        const response = await apiClient.put(`/admin/users/${id}/role`, { role });
        return response.data;
    },
    deleteUser: async (id: number) => {
        const response = await apiClient.delete(`/admin/users/${id}`);
        return response.data;
    },
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await apiClient.post('/admin/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

// Recommendation API (Collaborative Filtering)
export const recommendationAPI = {
    forUser: async (limit: number = 8) => {
        const response = await apiClient.get(`/recommendations/user?limit=${limit}`);
        return response.data;
    },
    forItem: async (productId: string | number, limit: number = 6) => {
        const response = await apiClient.get(`/recommendations/item/${productId}?limit=${limit}`);
        return response.data;
    },
    hybrid: async (limit: number = 8) => {
        const response = await apiClient.get(`/recommendations/hybrid?limit=${limit}`);
        return response.data;
    }
};

// AI Chat API (với DB context)
export const aiChatAPI = {
    send: async (message: string) => {
        const token = localStorage.getItem('token');
        const endpoint = token ? '/ai/chat' : '/ai/chat/public';
        const response = await apiClient.post(endpoint, { message });
        return response.data;
    }
};

export default apiClient;
