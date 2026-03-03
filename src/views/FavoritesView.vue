<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../stores/products.store'
import { useFavoritesStore } from '../stores/favorites.store'
import ProductSort from '../components/ProductSort.vue'
import ProductCard from '../components/ProductCard.vue';


const productStore = useProductsStore()
const { sort, loaded, loading, error, visibleProducts } = storeToRefs(productStore)
const { fetchProducts } = productStore

const favoritesStore = useFavoritesStore()
const { toggleFavorite } = favoritesStore

const favoritesSet = computed(() => new Set(favoritesStore.ids))
const isFav = (id: number) => favoritesSet.value.has(id)

const favoriteVisibleProducts = computed(() =>
  visibleProducts.value.filter((p) => isFav(p.id)),
)

onMounted(() => {
  // Ne charge les produits que si nécessaire
  if (favoritesStore.count > 0 && !loaded.value) fetchProducts()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="sort">
        <Product-sort v-model="sort" />
      </v-col>
    </v-row>

    <v-container class="products">
      <v-progress-linear v-if="loading" class="mb-4" indeterminate />

      <v-alert v-else-if="error" type="error" class="mb-4">
        {{ error.message }}
        <div class="mt-2">
          <v-btn size="small" variant="tonal" @click="fetchProducts()">Retry</v-btn>
        </div>
      </v-alert>

      <v-container v-else>
        <!-- Empty state "no favorites" (simple) -->
        <v-row v-if="favoritesStore.count === 0">
          <v-col cols="12">
            <v-alert type="info" variant="tonal">
              No favorites yet.
              <div class="mt-2">
                <v-btn :to="{ name: 'products' }" variant="flat">Browse products</v-btn>
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Data state -->
        <v-row v-else>
          <v-col v-if="favoriteVisibleProducts.length === 0" cols="12">
            <v-alert type="info" variant="tonal">
              No favorites found.
            </v-alert>
          </v-col>

          <v-col v-else v-for="item in favoriteVisibleProducts" :key="item.id" cols="12" sm="6" md="6" lg="4">
            <product-card :product="item" :isFavorite="isFav(item.id)" @toggle-favorite="toggleFavorite" />
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-container>
</template>

<style scoped></style>