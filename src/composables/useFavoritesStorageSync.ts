import { onMounted, onUnmounted } from "vue"

import { FAVORITES_KEY, useFavoritesStore } from "../stores/favorites.store"

export function useFavoritesStorageSync() {
  const favoritesStore = useFavoritesStore()

  const handleStorageEvent = (e: StorageEvent) => {
    if (!e.newValue) return
    if (e.storageArea !== localStorage || e.key !== FAVORITES_KEY) return

    favoritesStore.hydrateFromStorage()
  }

  onMounted(() => {
    window.addEventListener("storage", handleStorageEvent)
  })

  onUnmounted(() => {
    window.removeEventListener("storage", handleStorageEvent)
  })
}
