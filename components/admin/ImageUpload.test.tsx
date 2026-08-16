import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from './ImageUpload'

vi.mock('@/lib/supabase/client', () => ({
  createBrowserSupabaseClient: () => ({
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({
          data: { publicUrl: 'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg' },
        }),
      }),
    },
  }),
}))

describe('ImageUpload', () => {
  it('shows the current image when a value is set', () => {
    render(<ImageUpload value="https://images.unsplash.com/x" onChange={vi.fn()} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://images.unsplash.com/x')
  })

  it('uploads a selected file and calls onChange with the public URL', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload value="" onChange={onChange} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Ảnh sản phẩm')
    await user.upload(input, file)

    expect(onChange).toHaveBeenCalledWith(
      'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg'
    )
  })
})
