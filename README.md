# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 🔁 PROMPT DE REPRISE

Je travaille sur un projet Vue 3 + TypeScript strict + Vite + pnpm.

## 🧱 Stack

- Vue 3 `<script setup>`
- Pinia (Options Store)
- Vue Router 4
- Vuetify
- TypeScript strict
- API : https://fakestoreapi.com

---

## 📁 Architecture actuelle

```
src/
├─ api/
│  ├─ http.ts (apiGet<T>, ApiError avec kind: 'http' | 'network' | 'parse' | 'abort')
│  └─ product.api.ts (getProducts, getProduct, getCategories, getProductsByCategory avec AbortSignal)
│
├─ types/
│  └─ product.ts (Product, Rating, Category)
│
├─ stores/
│  ├─ products.store.ts
│  │   - state: items, categories, selectedCategory, loading, error, sort, loaded
│  │   - AbortController module-scope
│  │   - fetchProducts annule la requête précédente
│  │   - visibleProducts getter avec tri
│  │
│  └─ favorites.store.ts
│      - ids: number[]
│      - persistance localStorage
│      - toggleFavorite
│
├─ composables/
│  └─ useIsFavorite.ts (computed Set + isFav)
│
├─ components/
│  ├─ ProductCard.vue (props product + isFavorite | emits toggle-favorite typé)
│  └─ ProductSort.vue (defineModel sur sort)
│
└─ views/
   ├─ ProductsView.vue
   ├─ FavoritesView.vue
   └─ ProductDetailView.vue
```

---

## ✅ Ce qui fonctionne

- API layer entièrement typé
- Gestion fine des erreurs (ApiError avec kind)
- AbortController propre (store + detail view)
- Tri factorisé via ProductSort
- Card produit factorisée via ProductCard
- Favoris persistés dans localStorage
- Flag `loaded` pour distinguer non-chargé / chargé
- Membership favoris en O(1) via Set
- Events typés via `defineEmits`
- Architecture propre, séparation responsabilités
- Sync multi-tabs via event `storage`
- Configuration propre eslint

---

## 🎯 Objectif

Continuer l’exercice en mode professeur :

- Étapes guidées
- Indices techniques
- Pas de solution complète sauf demande explicite
- Reviews techniques
- Approche architecture propre
- Niveau intermédiaire → senior

---

## 🚀 Prochaine étape à définir

Possibilités :

- Pagination / infinite scroll
- Tests unitaires des stores
- Migration vers setup store
- Gestion erreurs avancée (retry policy, backoff)
- Optimisation réactivité
- Normalisation API layer
- Amélioration UX
- Autre

Repartons proprement à partir de cet état.
