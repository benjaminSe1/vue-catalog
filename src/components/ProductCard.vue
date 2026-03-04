<script setup lang="ts">
import type { Product } from "../types/product"

const { product, isFavorite } = defineProps<{
  product: Product
  isFavorite: boolean
}>()

const emit = defineEmits<{
  "toggle-favorite": [id: number]
}>()
</script>

<template>
  <v-card :to="`/products/${product.id}`" class="product-card" outlined>
    <v-card-title>{{ product.title }}</v-card-title>
    <v-img :src="product.image" :alt="product.title" aspect-ratio="16/9" height="200" />
    <v-row justify="space-around">
      <v-col>
        <v-card-text>Price: ${{ product.price }}</v-card-text>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn icon variant="text" @click.stop.prevent="emit('toggle-favorite', product.id)">
          <v-icon>
            {{ isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card-text>
      Rating: {{ product.rating.rate }} ({{ product.rating.count }} reviews)
    </v-card-text>
    <v-card-text>{{ product.description }}</v-card-text>
  </v-card>
</template>
