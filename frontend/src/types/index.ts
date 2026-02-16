export interface SiteConfig {
  id: string;
  company_name: string;
  logo_url?: string;
  header_text?: string;
  tagline?: string;
  primary_color: string;
  secondary_color: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  currency?: string;
  currency_symbol?: string;
  tax_rate?: number;
  free_shipping_threshold?: number;
  banner_enabled?: boolean;
  banner_text?: string;
  banner_link?: string;
  banner_color?: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  name: string;
  description?: string;
  order: number;
  is_active: boolean;
  parent_section_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  section_id: string;
  parent_category_id?: string;
  is_active: boolean;
  order: number;
  slug: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  cost?: number;
  category_id: string;
  section_id: string;
  sku: string;
  inventory_quantity: number;
  image_url?: string;
  is_active: boolean;
  featured: boolean;
  discount_percentage?: number;
  attributes?: Record<string, any>;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  billing_address?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: T[];
}

export interface CartItem extends Product {
  quantity: number;
}
