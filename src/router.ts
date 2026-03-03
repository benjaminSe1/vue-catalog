import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "home", path: '/', redirect: '/products' },
    { name: "products", path: '/products', component: () => import('./views/ProductsView.vue') },
    { name: "productDetail", path: '/products/:id', component: () => import('./views/ProductDetailView.vue') },
    { name: "favorits", path: '/favorites', component: () => import('./views/FavoritesView.vue') },
  ],
})