'use client'

import { useState, type FormEvent } from 'react'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên')
      return
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }
    setError(null)
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-brand-forest">Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium">
          Tên
        </label>
        <input
          id="contact-name"
          aria-label="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Lời nhắn
        </label>
        <textarea
          id="contact-message"
          aria-label="Lời nhắn"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-brand-forest px-6 py-3 text-sm font-medium text-brand-cream hover:opacity-90"
      >
        Gửi
      </button>
    </form>
  )
}
