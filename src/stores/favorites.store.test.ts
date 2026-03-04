import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FAVORITES_KEY, useFavoritesStore } from "./favorites.store"

describe("favorites store", () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  describe("initialization", () => {
    it("initializes ids from localStorage when data is valid", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
    })

    it("initializes ids to [] when localStorage key is missing", () => {
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([])
    })
    it("initializes ids to [] when localStorage contains invalid JSON", () => {
      const mockError = vi.spyOn(console, "error").mockImplementation(() => {})
      localStorage.setItem(FAVORITES_KEY, "{id: [{} ]}")
      const favoritesStore = useFavoritesStore()
      expect(mockError).toHaveBeenCalledWith(
        "An error happened while parsing favorites product",
        expect.any(Error),
      )
      expect(favoritesStore.ids).toStrictEqual([])
    })
    it("initializes ids by coercing string numbers and filtering non-finite values", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(["1", 2, "foo", null, "Infinity", "-3"]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
    })
    it("initializes ids to [] when localStorage JSON is not an array", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify({ ok: 1 }))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([])
    })
  })

  describe("count", () => {
    it("count reflects ids length", () => {
      localStorage.setItem(FAVORITES_KEY, "[1, 2]")
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.count).toStrictEqual(2)
    })
  })

  describe("addFavorite", () => {
    it("adds an id when not present", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.addFavorite(3)
      expect(favoritesStore.ids).toStrictEqual([1, 2, 3])
    })
    it("does not duplicate an id", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.addFavorite(3)
      favoritesStore.addFavorite(3)
      expect(favoritesStore.ids).toStrictEqual([1, 2, 3])
    })
    it("persists ids to localStorage", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.addFavorite(3)
      expect(favoritesStore.ids).toStrictEqual([1, 2, 3])
      expect(localStorage.getItem(FAVORITES_KEY)).toStrictEqual("[1,2,3]")
    })
  })

  describe("removeFavorite", () => {
    it("removes an existing id", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.removeFavorite(2)
      expect(favoritesStore.ids).toStrictEqual([1])
    })
    it("is idempotent when id does not exist", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.removeFavorite(3)
      expect(favoritesStore.ids).toStrictEqual([1, 2])
    })
    it("persists ids to localStorage", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.removeFavorite(2)
      expect(localStorage.getItem(FAVORITES_KEY)).toStrictEqual("[1]")
      expect(favoritesStore.ids).toStrictEqual([1])
    })
  })

  describe("toggleFavorite", () => {
    it("adds when id is absent", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.toggleFavorite(3)
      expect(favoritesStore.ids).toStrictEqual([1, 2, 3])
    })
    it("removes when id is present", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.toggleFavorite(2)
      expect(favoritesStore.ids).toStrictEqual([1])
    })
    it("persists ids to localStorage", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2]))
      const favoritesStore = useFavoritesStore()
      expect(favoritesStore.ids).toStrictEqual([1, 2])
      favoritesStore.toggleFavorite(2)
      expect(localStorage.getItem(FAVORITES_KEY)).toStrictEqual("[1]")
      expect(favoritesStore.ids).toStrictEqual([1])
    })
  })

  describe("invariants", () => {
    it("persists exactly the current ids array (same order) to localStorage", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([2]))
      const favoritesStore = useFavoritesStore()
      favoritesStore.addFavorite(1)
      expect(favoritesStore.ids).toStrictEqual([2, 1])
    })
  })
})
