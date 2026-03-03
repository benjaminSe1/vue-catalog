import { defineStore } from 'pinia'

type FavoritesState = {
    ids: number[]
}

const KEY = "favorites";
const persist = (ids: number[]) => localStorage.setItem(KEY, JSON.stringify(ids))

export const useFavoritesStore = defineStore('favorites', {
    state: (): FavoritesState => ({
        ids: JSON.parse(localStorage.getItem(KEY) ?? '[]'),
    }),
    actions: {
        addFavorite(id: number) {
            if (!this.ids.includes(id)) this.ids.push(id)
            persist(this.ids)
        },
        removeFavorite(id: number) {
            this.ids = this.ids.filter(i => i !== id)
            persist(this.ids)
        },
        toggleFavorite(id: number) {
            if (this.ids.includes(id)) this.removeFavorite(id)
            else this.addFavorite(id)
            persist(this.ids)
        }
    },
    getters: {
        count: (state) => state.ids.length,
    }
})