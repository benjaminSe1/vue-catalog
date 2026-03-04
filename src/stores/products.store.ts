import { defineStore } from "pinia"
import { computed, ref } from "vue"

import { ApiError } from "../api/http"
import { getCategories, getProducts, getProductsByCategory } from "../api/product.api"
import type { Category, Product } from "../types/product"

export type SortMode = "priceAsc" | "priceDesc" | "ratingDesc"

export const useProductsStore = defineStore("products", () => {
  // state
  const items = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const selectedCategory = ref<Category | null>(null)
  const loaded = ref(false)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const sort = ref<SortMode>("priceAsc")

  // request cancellation (store-scope)
  let abortController: AbortController | null = null

  // actions
  async function fetchCategories() {
    loading.value = true
    try {
      categories.value = await getCategories()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.kind !== "abort") error.value = err
    } finally {
      loading.value = false
    }
  }

  async function fetchProducts() {
    error.value = null
    loading.value = true

    const currentController = new AbortController()

    try {
      abortController?.abort()
      abortController = currentController

      items.value = selectedCategory.value
        ? await getProductsByCategory(selectedCategory.value, currentController.signal)
        : await getProducts(currentController.signal)

      loaded.value = true
    } catch (err: unknown) {
      if (err instanceof ApiError && err.kind !== "abort") error.value = err
    } finally {
      // avoid flipping loading=false if a newer request is in flight
      if (abortController === currentController) {
        abortController = null
        loading.value = false
      }
    }
  }

  function setCategory(category: Category | null) {
    selectedCategory.value = category
  }

  // getters
  const visibleProducts = computed<Product[]>(() => {
    const list = [...items.value]
    switch (sort.value) {
      case "priceAsc":
        return list.sort((a, b) => a.price - b.price)
      case "priceDesc":
        return list.sort((a, b) => b.price - a.price)
      case "ratingDesc":
        return list.sort((a, b) => b.rating.rate - a.rating.rate)
      default:
        return list.sort((a, b) => a.price - b.price)
    }
  })

  return {
    // state
    items,
    categories,
    selectedCategory,
    loaded,
    loading,
    error,
    sort,

    // actions
    fetchCategories,
    fetchProducts,
    setCategory,

    // getters
    visibleProducts,
  }
})
