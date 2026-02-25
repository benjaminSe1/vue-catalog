export type Category = string

export type Rating = {
  rate: number
  count: number
}

export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: Category
  image: string
  rating: Rating
}