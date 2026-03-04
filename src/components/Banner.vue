<script setup lang="ts">
import { storeToRefs } from "pinia"
import { onMounted, watch } from "vue"

import { useProductsStore } from "../stores/products.store"

const productStore = useProductsStore()
const { selectedCategory } = storeToRefs(productStore)
const { fetchProducts, fetchCategories } = productStore
onMounted(async () => {
    await fetchCategories()
})
watch(selectedCategory, () => fetchProducts())
</script>

<template>
    <v-app-bar class="banner">
        <h1>Products</h1>
        <span @click="$router.push(`/favorites`)">Favorites</span>
        <span v-if="selectedCategory">{{ selectedCategory }}</span>
    </v-app-bar>
</template>
