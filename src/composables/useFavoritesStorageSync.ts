import { onMounted, onUnmounted } from "vue";
import { FAVORITES_KEY, useFavoritesStore } from "../stores/favorites.store";

export function useFavoritesStorageSync() {
    const { hydrateFromStorage } = useFavoritesStore()

    const handlerStorageEvent = (e: StorageEvent) => {
        if (e.storageArea !== localStorage || e.key !== FAVORITES_KEY) return
        hydrateFromStorage()
    }

    onMounted(() => {
        window.addEventListener('storage', handlerStorageEvent)
    })

    onUnmounted(() => {
        window.removeEventListener('storage', handlerStorageEvent)
    })
}