import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const FAVORITES_KEY = "favorites:ids"

const persistIds = (ids: number[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

const parseJsonUnknown = (raw: string): unknown => JSON.parse(raw)

const toFiniteNumberArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((v) => (typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN))
    .filter(Number.isFinite)
}

const getIds = (jsonToParse: string): number[] => {
  try {
    return toFiniteNumberArray(parseJsonUnknown(jsonToParse))
  } catch (error: unknown) {
    console.error("An error happened while parsing favorites product", error)
    return []
  }
}

export const useFavoritesStore = defineStore("favorites", () => {
  const ids = ref<number[]>(getIds(localStorage.getItem(FAVORITES_KEY) ?? "[]"))

  const count = computed(() => ids.value.length)

  function addFavorite(id: number) {
    if (!ids.value.includes(id)) ids.value.push(id)
    persistIds(ids.value)
  }

  function removeFavorite(id: number) {
    ids.value = ids.value.filter((i) => i !== id)
    persistIds(ids.value)
  }

  function toggleFavorite(id: number) {
    if (ids.value.includes(id)) removeFavorite(id)
    else addFavorite(id)
  }

  function hydrateFromStorage() {
    ids.value = getIds(localStorage.getItem(FAVORITES_KEY) ?? "[]")
  }

  return { ids, count, addFavorite, removeFavorite, toggleFavorite, hydrateFromStorage }
})
