import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MenuImage } from './MenuImage'

describe('MenuImage', () => {
  it('shows a placeholder when the remote image fails', () => {
    render(<MenuImage src="https://images.unsplash.com/broken" name="Cà phê muối" sizes="100vw" />)

    fireEvent.error(screen.getByRole('img', { name: 'Cà phê muối' }))

    expect(screen.queryByRole('img', { name: 'Cà phê muối' })).not.toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })
})
