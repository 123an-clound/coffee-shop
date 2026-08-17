import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from './ImageUpload'
import { uploadMenuImageAction } from '@/app/admin/menu/upload-image-action'

vi.mock('@/app/admin/menu/upload-image-action', () => ({
  uploadMenuImageAction: vi.fn(),
}))

describe('ImageUpload', () => {
  it('shows the current image when a value is set', () => {
    render(<ImageUpload value="https://images.unsplash.com/x" onChange={vi.fn()} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://images.unsplash.com/x')
  })

  it('uploads a selected file and calls onChange with the public URL', async () => {
    vi.mocked(uploadMenuImageAction).mockResolvedValue({
      url: 'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg',
    })
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

  it('shows an error and does not call onChange when the server rejects the file', async () => {
    vi.mocked(uploadMenuImageAction).mockResolvedValue({
      error: 'Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.',
    })
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload value="" onChange={onChange} />)

    const file = new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Ảnh sản phẩm')
    await user.upload(input, file)

    expect(await screen.findByText('Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })
})
