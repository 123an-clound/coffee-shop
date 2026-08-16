import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('shows a validation error when submitting with an empty name', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Gửi' }))

    expect(await screen.findByText('Vui lòng nhập tên')).toBeInTheDocument()
  })

  it('shows a success message after submitting valid data', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Tên'), 'Nguyễn Văn A')
    await user.type(screen.getByLabelText('Email'), 'a@example.com')
    await user.type(screen.getByLabelText('Lời nhắn'), 'Tôi muốn hỏi về giờ mở cửa')
    await user.click(screen.getByRole('button', { name: 'Gửi' }))

    expect(
      await screen.findByText('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.')
    ).toBeInTheDocument()
  })
})
