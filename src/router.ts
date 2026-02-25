import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/products' },
    { path: '/products', component: () => import('./views/ProductsView.vue') },
    { path: '/products/:id', component: () => import('./views/ProductDetailView.vue') },
    { path: '/favorites', component: () => import('./views/FavoritesView.vue') },
  ],
})