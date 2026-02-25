import { apiGet } from "./http";
import type { Category, Product } from "../types/product";

export const getProducts = (signal?: AbortSignal) => apiGet<Product[]>('/products', { signal })
export const getProduct = (id: number, signal?: AbortSignal) => apiGet<Product>(`/products/${id}`, { signal })
export const getCategories = (signal?: AbortSignal) => apiGet<Category[]>('/products/categories', { signal })
export const getProductsByCategory = (category: Category, signal?: AbortSignal) => apiGet<Product[]>(`/products/category/${encodeURIComponent(category)}`, { signal })