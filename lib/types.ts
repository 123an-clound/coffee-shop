export type Category = {
  id: string
  name: string
  slug: string
  display_order: number
}

export type MenuItem = {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type MenuItemInput = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>
export type CategoryInput = Omit<Category, 'id'>
