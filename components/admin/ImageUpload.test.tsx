import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from './ImageUpload'
import { uploadMenuImageAction } from '@/app/admin/menu/upload-image-action'

vi.mock('@/app/admin/menu/upload-image-action', () => ({
  uploadMenuImageAction: vi.fn(),
}))

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.mocked(uploadMenuImageAction).mockClear()
  })

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

  it('shows a generic error and clears the uploading state when the action rejects', async () => {
    vi.mocked(uploadMenuImageAction).mockRejectedValue(new Error('boom'))
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload value="" onChange={onChange} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Ảnh sản phẩm')
    await user.upload(input, file)

    expect(await screen.findByText('Tải ảnh lên thất bại. Vui lòng thử lại.')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('rejects an oversized file client-side without calling the server action', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload value="" onChange={onChange} />)

    const bigFile = new File([new Uint8Array(6 * 1024 * 1024)], 'big.jpg', {
      type: 'image/jpeg',
    })
    const input = screen.getByLabelText('Ảnh sản phẩm')
    await user.upload(input, bigFile)

    expect(await screen.findByText('Ảnh không được vượt quá 5MB.')).toBeInTheDocument()
    expect(uploadMenuImageAction).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })
})
