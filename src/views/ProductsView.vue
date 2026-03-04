<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed, onMounted, watch } from "vue"

import ProductCard from "../components/ProductCard.vue"
import ProductSort from "../components/ProductSort.vue"
import { useFavoritesStore } from "../stores/favorites.store"
import { useProductsStore } from "../stores/products.store"

const productStore = useProductsStore()
const { categories, selectedCategory, sort, loading, error, visibleProducts } =
    storeToRefs(productStore)
const { fetchProducts, fetchCategories } = productStore

const favoritesStore = useFavoritesStore()
const { toggleFavorite } = favoritesStore

const favoritesSet = computed(() => new Set(favoritesStore.ids))
const isFav = (id: number) => favoritesSet.value.has(id)

onMounted(async () => {
    await Promise.allSettled([fetchCategories(), fetchProducts()])
})

watch(selectedCategory, () => fetchProducts())

const computedCategories = computed(() => [
    { value: null, title: "All categories" },
    ...categories.value.map((cat) => ({ value: cat, title: cat })),
])
</script>

<template>
    <v-container>
        <v-row>
            <v-col class="categories">
                <h2>Categories</h2>
                <v-select v-model="selectedCategory" item-title="title" item-value="value" :items="computedCategories"
                    clearable label="Select Category" />
            </v-col>
            <v-col class="sort">
                <product-sort v-model="sort" />
            </v-col>
        </v-row>
        <v-container class="products">
            <v-progress-linear v-if="loading" class="mb-4" indeterminate />
            <v-alert v-else-if="error" type="error">
                {{ error.message }}
            </v-alert>
            <v-container v-else>
                <v-row>
                    <v-col v-for="item in visibleProducts" :key="item.id" cols="12" md="6" lg="4" sm="6">
                        <product-card :product="item" :is-favorite="isFav(item.id)" @toggle-favorite="toggleFavorite" />
                    </v-col>
                </v-row>
            </v-container>
        </v-container>
    </v-container>
</template>

<style scoped></style>
