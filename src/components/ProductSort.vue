<script setup lang="ts">
import type { SortMode } from "../stores/products.store"

const model = defineModel<SortMode>()

const sortKeys = [
    { value: "priceAsc", title: "Price: Low to High" },
    { value: "priceDesc", title: "Price: High to Low" },
    { value: "ratingDesc", title: "Rating: High to Low" },
] as const
</script>

<template>
    <h2>Sort By</h2>
    <v-select v-model="model" :items="sortKeys" item-title="title" item-value="value" label="Select Sort" />
</template>
