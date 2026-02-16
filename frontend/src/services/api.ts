import axios, { AxiosResponse } from 'axios';
import {
  SiteConfig,
  Section,
  Category,
  Product,
  Order,
  PaginatedResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface QueryParams {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  search?: string;
}

export const siteConfigAPI = {
  get: (): Promise<AxiosResponse<SiteConfig>> => api.get('/site-config'),
  update: (data: Partial<SiteConfig>): Promise<AxiosResponse<SiteConfig>> => 
    api.put('/site-config', data),
};

export const sectionsAPI = {
  getAll: (params?: QueryParams): Promise<AxiosResponse<PaginatedResponse<Section>>> =>
    api.get('/sections', { params }),
  getById: (id: string): Promise<AxiosResponse<Section>> =>
    api.get(`/sections/${id}`),
};

export const categoriesAPI = {
  getAll: (params?: QueryParams): Promise<AxiosResponse<PaginatedResponse<Category>>> =>
    api.get('/categories', { params }),
  getById: (id: string): Promise<AxiosResponse<Category>> =>
    api.get(`/categories/${id}`),
  getBySection: (
    sectionId: string,
    params?: QueryParams
  ): Promise<AxiosResponse<PaginatedResponse<Category>>> =>
    api.get(`/categories/by-section/${sectionId}`, { params }),
};

export const productsAPI = {
  getAll: (params?: QueryParams): Promise<AxiosResponse<PaginatedResponse<Product>>> =>
    api.get('/products', { params }),
  getById: (id: string): Promise<AxiosResponse<Product>> =>
    api.get(`/products/${id}`),
  getByCategory: (
    categoryId: string,
    params?: QueryParams
  ): Promise<AxiosResponse<PaginatedResponse<Product>>> =>
    api.get(`/products/by-category/${categoryId}`, { params }),
  getBySection: (
    sectionId: string,
    params?: QueryParams
  ): Promise<AxiosResponse<PaginatedResponse<Product>>> =>
    api.get(`/products/by-section/${sectionId}`, { params }),
  getFeatured: (params?: QueryParams): Promise<AxiosResponse<PaginatedResponse<Product>>> =>
    api.get('/products/featured', { params }),
  search: (query: string): Promise<AxiosResponse<Product[]>> =>
    api.get('/products/search', { params: { q: query } }),
};

export const ordersAPI = {
  create: (data: Partial<Order>): Promise<AxiosResponse<Order>> =>
    api.post('/orders', data),
  getById: (id: string): Promise<AxiosResponse<Order>> =>
    api.get(`/orders/${id}`),
};

export default api;
