# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


### 🔁 PROMPT DE REPRISE

Je travaille sur un projet Vue 3 + TypeScript + Vite avec pnpm.

Stack actuelle :
- Vue 3
- Pinia (object store syntax)
- Vue Router v4
- Vuetify
- TypeScript strict
- API : https://fakestoreapi.com

Architecture actuelle :

src/
- api/
  - http.ts (apiGet<T>, ApiError avec kind: 'http' | 'network' | 'parse' | 'abort')
  - products.api.ts (getProducts, getProduct, getCategories, getProductsByCategory avec AbortSignal)
- types/
  - product.ts (Product, Rating, Category)
- stores/
  - products.store.ts (Pinia store avec AbortController module-scope, fetchProducts, fetchCategories, getter visibleProducts avec tri)
- views/
  - ProductsView.vue (en cours de construction)

Le store :
- state :
  - items: Product[]
  - categories: Category[]
  - selectedCategory: Category | null
  - loading: boolean
  - error: ApiError | null
  - sort: 'priceAsc' | 'priceDesc' | 'ratingDesc'
- abortController en module scope
- fetchProducts annule la requête précédente
- visibleProducts retourne une copie triée

Ce qui fonctionne :
- API layer complet et typé
- AbortController géré côté store
- Tri côté getter

Ce qui reste à faire :
- Finaliser ProductsView.vue
  - onMounted : fetchCategories + fetchProducts
  - watch selectedCategory → refetch
  - v-select catégorie + sort
  - grid produits (Vuetify)
- Puis ProductDetailView
- Puis favorites store + persistance localStorage

Je veux continuer l’exercice en mode professeur :
- Donne-moi les étapes
- Donne-moi des indices
- Ne me donne pas directement la solution complète
- Fais des reviews techniques

On reprend à la construction propre de ProductsView.vue.