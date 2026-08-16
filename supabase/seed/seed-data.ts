// One-time / local reseed script for populating categories and menu_items.
//
// Since the Task 2 migration, INSERT on categories/menu_items is admin-only
// via RLS, so this script requires SUPABASE_SERVICE_ROLE_KEY (found in the
// Supabase dashboard under Project Settings -> API) to bypass RLS as a
// privileged client. It falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY only to
// throw a clear error, since the anon key cannot write these tables.
//
// SUPABASE_SERVICE_ROLE_KEY must NEVER be committed, exposed to client code,
// or used anywhere in the app's runtime. Run this manually from a developer
// machine only, e.g.:
//   SUPABASE_SERVICE_ROLE_KEY=... npx tsx supabase/seed/seed-data.ts
import { createClient } from '@supabase/supabase-js'
import type { CategoryInput, MenuItemInput } from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is required to run this script. ' +
      'The anon key cannot insert into categories/menu_items (admin-only RLS policy). ' +
      'Find the service role key in the Supabase dashboard under Project Settings -> API, ' +
      'and set it as an environment variable for this one-time run only — never commit it.'
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const categories: CategoryInput[] = [
  { name: 'Cà phê phin truyền thống', slug: 'ca-phe-phin', display_order: 0 },
  { name: 'Espresso & cà phê máy', slug: 'espresso', display_order: 1 },
  { name: 'Cold Brew & Đặc biệt', slug: 'cold-brew', display_order: 2 },
  { name: 'Cà phê & trà trái cây', slug: 'trai-cay', display_order: 3 },
  { name: 'Trà & thảo mộc', slug: 'tra-thao-moc', display_order: 4 },
  { name: 'Đá xay / Sinh tố & Bánh', slug: 'da-xay-banh', display_order: 5 },
]

type SeedItem = {
  categorySlug: string
  name: string
  description: string
  price: number
  image_url: string
  is_featured?: boolean
}

const items: SeedItem[] = [
  // A. Cà phê phin truyền thống
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Đen Đá', description: 'Đậm đà, thơm nồng hương cà phê phin truyền thống.', price: 39000, image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800', is_featured: true },
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Sữa Đá', description: 'Vị béo ngậy của sữa đặc hòa cùng cà phê phin đậm đà.', price: 45000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800', is_featured: true },
  { categorySlug: 'ca-phe-phin', name: 'Bạc Xỉu', description: 'Nhiều sữa, ít cà phê — dịu nhẹ, dễ uống.', price: 45000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800' },
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Muối', description: 'Kem muối béo mịn phủ trên cà phê đen đậm đà.', price: 49000, image_url: 'https://images.unsplash.com/photo-1621912450937-77fabc154e00?w=800' },
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Trứng', description: 'Lớp kem trứng đánh bông mịn màng, béo thơm đặc trưng.', price: 55000, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800' },

  // B. Espresso & cà phê máy hiện đại
  { categorySlug: 'espresso', name: 'Espresso', description: 'Tách espresso nguyên bản, đậm vị cà phê rang xay.', price: 45000, image_url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800' },
  { categorySlug: 'espresso', name: 'Americano', description: 'Espresso pha loãng cùng nước nóng, thanh nhẹ.', price: 49000, image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800' },
  { categorySlug: 'espresso', name: 'Cappuccino', description: 'Espresso, sữa nóng và lớp bọt sữa dày mịn.', price: 55000, image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800', is_featured: true },
  { categorySlug: 'espresso', name: 'Latte', description: 'Espresso hòa quyện cùng sữa tươi béo mịn.', price: 58000, image_url: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800' },
  { categorySlug: 'espresso', name: 'Caramel Macchiato', description: 'Latte phủ sốt caramel ngọt ngào, thơm béo.', price: 65000, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800' },

  // C. Cold Brew & Đặc biệt
  { categorySlug: 'cold-brew', name: 'Cold Brew Nguyên Bản', description: 'Cà phê ủ lạnh 12 giờ, vị êm dịu, ít chua.', price: 55000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800' },
  { categorySlug: 'cold-brew', name: 'Cold Brew Sữa Dừa', description: 'Cold brew kết hợp sữa dừa béo thơm.', price: 62000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800' },
  { categorySlug: 'cold-brew', name: 'Espresso Tonic', description: 'Espresso hòa cùng soda tonic sảng khoái.', price: 60000, image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800' },

  // D. Cà phê & trà trái cây
  { categorySlug: 'trai-cay', name: 'Cà Phê Xoài Sữa Dừa', description: 'Vị chua ngọt xoài chín hòa cùng cà phê và sữa dừa.', price: 62000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800', is_featured: true },
  { categorySlug: 'trai-cay', name: 'Americano Quýt Vải', description: 'Thanh mát vị quýt và vải, hòa quyện cùng espresso.', price: 58000, image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800' },
  { categorySlug: 'trai-cay', name: 'Cold Brew Đào', description: 'Cold brew kết hợp siro đào ngọt dịu.', price: 58000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800' },
  { categorySlug: 'trai-cay', name: 'Trà Đào Cam Sả', description: 'Trà đào thơm mát cùng cam tươi và sả.', price: 55000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800' },

  // E. Trà & thức uống thảo mộc
  { categorySlug: 'tra-thao-moc', name: 'Trà Sen Vàng', description: 'Hương sen thanh khiết, vị trà dịu nhẹ.', price: 45000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800' },
  { categorySlug: 'tra-thao-moc', name: 'Trà Thái Xanh Kem Cheese', description: 'Trà xanh Thái đậm vị, phủ kem cheese béo mặn.', price: 55000, image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800' },
  { categorySlug: 'tra-thao-moc', name: 'Matcha Latte', description: 'Bột trà xanh Nhật Bản hòa cùng sữa tươi béo mịn.', price: 58000, image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800', is_featured: true },
  { categorySlug: 'tra-thao-moc', name: 'Trà Gừng Mật Ong', description: 'Ấm nóng vị gừng cay nhẹ hòa cùng mật ong.', price: 45000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800' },

  // F. Đá xay / Sinh tố & Bánh
  { categorySlug: 'da-xay-banh', name: 'Sinh Tố Bơ', description: 'Bơ sáp béo ngậy xay cùng sữa tươi mát lạnh.', price: 55000, image_url: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800' },
  { categorySlug: 'da-xay-banh', name: 'Chocolate Đá Xay', description: 'Socola đậm đà xay đá mịn, phủ kem tươi.', price: 60000, image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800' },
  { categorySlug: 'da-xay-banh', name: 'Bánh Tiramisu', description: 'Lớp bông lan thấm cà phê, phủ kem mascarpone.', price: 65000, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800' },
  { categorySlug: 'da-xay-banh', name: 'Bánh Croissant Bơ', description: 'Vỏ bánh giòn xốp nhiều lớp, thơm bơ béo ngậy.', price: 35000, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800' },
]

async function seed() {
  console.log('Seeding categories...')
  const slugToId = new Map<string, string>()

  for (const category of categories) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()
    if (error) throw error
    slugToId.set(category.slug, data.id)
  }

  console.log('Seeding menu items...')
  let order = 0
  for (const item of items) {
    const category_id = slugToId.get(item.categorySlug)
    if (!category_id) throw new Error(`Unknown category slug: ${item.categorySlug}`)

    const input: MenuItemInput = {
      category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      is_available: true,
      is_featured: item.is_featured ?? false,
      display_order: order++,
    }

    const { error } = await supabase.from('menu_items').insert([input])
    if (error) throw error
  }

  console.log(`Seeded ${categories.length} categories and ${items.length} menu items.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
