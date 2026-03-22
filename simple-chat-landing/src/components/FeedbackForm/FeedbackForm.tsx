"use client"

import { useState } from 'react'
import { submitEmail } from '@/app/actions/submitEmail'
import styles from './FeedbackForm.module.css'

export default function FeedbackForm() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await submitEmail(formData)

    if (result.success) {
      setEmail(result.message)
      setSent(true)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <div className={styles.success}>
        ✅ Спасибо! Мы напишем на <strong>{email}</strong>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Хочешь попробовать?</h2>
      <p className={styles.subtitle}>Оставь email — пришлём ссылку на чат</p>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="your@email.com"
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? '...' : 'Отправить'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  )
}