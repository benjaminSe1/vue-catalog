import { defineStore } from 'pinia'

type FavoritesState = {
    ids: number[]
}

const KEY = "favorites";
const persist = (ids: number[]) => localStorage.setItem(KEY, JSON.stringify(ids))
const safeParseIds = (jsonToParse: string) => {
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
        ids: safeParseIds(localStorage.getItem(KEY) ?? '[]'),
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
        }
    },
    getters: {
        count: (state) => state.ids.length,
    }
})