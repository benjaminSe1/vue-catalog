import { defineStore } from 'pinia'
import type { Category, Product } from '../types/product'
import { ApiError } from '../api/http'
import { getCategories, getProducts, getProductsByCategory } from '../api/product.api'

type ProductsState = {
    items: Product[]
    categories: Category[]
    selectedCategory: Category | null
    loading: boolean
    error: ApiError | null
    sort: 'priceAsc' | 'priceDesc' | 'ratingDesc'
}

let abortController: AbortController | null = null

export const useProductsStore = defineStore('products', {
    state: (): ProductsState => ({
        items: [],
        categories: [],
        selectedCategory: null,
        loading: false,
        error: null,
        sort: 'priceAsc'
    }),
    actions: {
        async fetchCategories() {
            this.loading = true
            try {
                this.categories = await getCategories()
            } catch (error) {
                if (error instanceof ApiError && error.kind !== "abort") this.error = error
            } finally {
                this.loading = false
            }
        },
        async fetchProducts() {
            this.error = null
            this.loading = true
            const currentController = new AbortController()
            try {
                if (abortController) abortController.abort()
                abortController = currentController
                this.items = this.selectedCategory ? await getProductsByCategory(this.selectedCategory, abortController.signal) : await getProducts(abortController.signal)
            } catch (error) {
                if (error instanceof ApiError && error.kind !== "abort") this.error = error
            } finally {
                if (abortController === currentController) {
                    abortController = null
                    this.loading = false
                }
            }
        },
    },
    getters: {
        visibleProducts: (state) => {
            const list = [...state.items]
            switch (state.sort) {
                case 'priceAsc':
                    return list.sort((a, b) => a.price - b.price)
                case 'priceDesc':
                    return list.sort((a, b) => b.price - a.price)
                case 'ratingDesc':
                    return list.sort((a, b) => b.rating.rate - a.rating.rate)
                default: return list
            }
        }
    }
})