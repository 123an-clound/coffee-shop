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
    return <p className="contact-form__success" role="status">Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div>
        <label htmlFor="contact-name">
          Tên
        </label>
        <input
          id="contact-name"
          aria-label="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="contact-form__input"
        />
      </div>
      <div>
        <label htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="contact-form__input"
        />
      </div>
      <div>
        <label htmlFor="contact-message">
          Lời nhắn
        </label>
        <textarea
          id="contact-message"
          aria-label="Lời nhắn"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="contact-form__input"
        />
      </div>
      {error && <p className="contact-form__error" role="alert">{error}</p>}
      <button
        type="submit"
        className="site-button site-button--dark"
      >
        Gửi
      </button>
    </form>
  )
}
