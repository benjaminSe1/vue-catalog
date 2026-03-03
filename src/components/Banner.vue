<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useProductsStore } from '../stores/products.store';
import { storeToRefs } from 'pinia';


const productStore = useProductsStore()
const { selectedCategory,  } = storeToRefs(productStore)
  const { fetchProducts, fetchCategories, setCategory } = productStore
onMounted(async () => {
 await fetchCategories()
})
watch(selectedCategory, () => fetchProducts())
</script>



<template>
    <v-app-bar class="banner">
        <h1>Products</h1>
        <span v-if="selectedCategory">{{ selectedCategory }}</span>
    </v-app-bar>
</template>