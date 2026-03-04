<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { ApiError } from "../api/http"
import { getProduct } from "../api/product.api"
import { useFavoritesStore } from "../stores/favorites.store"
import type { Product } from "../types/product"

let abortController: AbortController | null = null
const router = useRouter()
const route = useRoute()
const idProduct = computed(() =>
  typeof route.params.id === "string" && Number.isFinite(Number(route.params.id))
    ? Number(route.params.id)
    : null,
)

const favoritesStore = useFavoritesStore()
const { ids: favoritesProducts } = storeToRefs(favoritesStore)
const { toggleFavorite } = favoritesStore
const isFavorite = computed(
  () => !!idProduct.value && favoritesProducts.value?.includes(idProduct.value),
)

const loading = ref(false)
const error = ref<ApiError | null>(null)
const currentProduct = ref<Product | null>(null)

const setProductDetail = async (id: number) => {
  loading.value = true
  error.value = null
  currentProduct.value = null
  const currentController = new AbortController()
  try {
    abortController?.abort()
    abortController = currentController
    currentProduct.value = await getProduct(id, abortController.signal)
  } catch (err: unknown) {
    if (err instanceof ApiError) error.value = err
    else
      error.value = {
        message: "An unexpected error occurred",
        kind: "network",
        name: "Unexpected Error",
      }
  } finally {
    if (abortController === currentController) {
      abortController = null
      loading.value = false
    }
  }
}

watch(idProduct, (id) => id && setProductDetail(id), { immediate: true })

onBeforeUnmount(() => abortController?.abort())
</script>

<template>
  <v-container>
    <!-- Back -->
    <v-row>
      <v-col cols="12">
        <v-btn variant="text" class="pa-0" @click="router.push({ name: 'products' })">
          Back to Products
        </v-btn>
      </v-col>
    </v-row>

    <!-- Content -->
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-skeleton-loader v-if="loading" type="card" />
        <v-alert v-else-if="error" type="error">
          {{ error.message }}
        </v-alert>
        <v-card v-else-if="currentProduct" class="product-card" variant="outlined">
          <v-btn
            icon
            variant="text"
            class="position-absolute top-0 right-0"
            @click="toggleFavorite(currentProduct.id)"
          >
            <v-icon>
              {{ isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
            </v-icon>
          </v-btn>
          <v-card-title>{{ currentProduct.title }}</v-card-title>
          <v-img
            :src="currentProduct.image"
            :alt="currentProduct.title"
            aspect-ratio="16/9"
            height="200"
          />
          <v-card-text>Price: ${{ currentProduct.price }}</v-card-text>
          <v-card-text>
            Rating: {{ currentProduct.rating.rate }} ({{ currentProduct.rating.count }}
            reviews)
          </v-card-text>
          <v-card-text>{{ currentProduct.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
