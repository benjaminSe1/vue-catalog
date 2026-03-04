import { defineStore } from 'pinia'

type FavoritesState = {
    ids: number[]
}

export const FAVORITES_KEY = "favorites:ids";
const persistIds = (ids: number[]) => localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
const getIds = (jsonToParse: string) => {
    try {
        const ids = JSON.parse(jsonToParse)
        if (Array.isArray(ids)) {
            return ids.map(Number).filter(Number.isFinite)
        } else {
            throw new Error("Invalid ids")
        }
    } catch (error: unknown) {
        console.error("An error happened while parsing favorites product", error)
        return []
    }
}

export const useFavoritesStore = defineStore('favorites', {
    state: (): FavoritesState => ({
        ids: getIds(localStorage.getItem(FAVORITES_KEY) ?? '[]'),
    }),
    actions: {
        addFavorite(id: number) {
            if (!this.ids.includes(id)) this.ids.push(id)
            persistIds(this.ids)
        },
        removeFavorite(id: number) {
            this.ids = this.ids.filter(i => i !== id)
            persistIds(this.ids)
        },
        toggleFavorite(id: number) {
            if (this.ids.includes(id)) this.removeFavorite(id)
            else this.addFavorite(id)
        },
        hydrateFromStorage() {
            this.ids = getIds(localStorage.getItem(FAVORITES_KEY) ?? '[]')
        }
    },
    getters: {
        count: (state) => state.ids.length,
    }
})