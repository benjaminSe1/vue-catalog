<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useProductsStore } from '../stores/products.store';
import { storeToRefs } from 'pinia';
import { useFavoritesStore } from '../stores/favorites.store';

const productStore = useProductsStore()
const { categories, selectedCategory, sort, loading, error, visibleProducts } = storeToRefs(productStore)
const { fetchProducts, fetchCategories } = productStore

const favoritesStore = useFavoritesStore()
const { ids: favoritesProducts } = storeToRefs(favoritesStore)
const { toggleFavorite } = favoritesStore

onMounted(() => {
  Promise.allSettled([fetchCategories(), fetchProducts()])
})

watch(selectedCategory, (newVal, oldVal) => { if (newVal !== oldVal) fetchProducts() })


const computedCategories = computed(() => [
  { value: null, title: 'All categories' },
  ...categories.value.map((cat) => ({ value: cat, title: cat }))
])

const sortKeys = [
  { value: 'priceAsc', title: 'Price: Low to High' },
  { value: 'priceDesc', title: 'Price: High to Low' },
  { value: 'ratingDesc', title: 'Rating: High to Low' }
]
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="categories">
        <h2>Categories</h2>
        <v-select v-model="selectedCategory" item-title="title" item-value="value" :items="computedCategories" clearable
          label="Select Category"></v-select>
      </v-col>
      <v-col class="sort">
        <h2>Sort By</h2>
        <v-select v-model="sort" :items="sortKeys" item-title="title" item-value="value" clearable
          label="Select Sort"></v-select>
      </v-col>
    </v-row>
    <v-container class="products">
      <v-progress-linear v-if="loading" class="mb-4" indeterminate></v-progress-linear>
      <v-alert v-else-if="error" type="error">{{ error.message }}</v-alert>
      <v-container v-else>
        <v-row>
          <v-col v-for="item in visibleProducts" :key="item.id" cols="12" md="6" lg="4" sm="6">
            <v-card @click="$router.push(`/products/${item.id}`)" class="product-card" outlined>
              <v-btn icon variant="text" @click="toggleFavorite(item.id)" class="position-absolute top-0 right-0">
                <v-icon>
                  {{ favoritesProducts.includes(item.id) ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
              <v-card-title>{{ item.title }}</v-card-title>
              <v-img :src="item.image" :alt="item.title" aspect-ratio="16/9" height="200" />
              <v-card-text>Price: ${{ item.price }}</v-card-text>
              <v-card-text>Rating: {{ item.rating.rate }} ({{ item.rating.count }} reviews)</v-card-text>
              <v-card-text>{{ item.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-container>
</template>

<style scoped></style>
