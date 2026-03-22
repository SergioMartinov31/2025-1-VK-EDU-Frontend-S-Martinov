"use client"

import { useState } from 'react'
import Image from 'next/image'
import styles from './ScreenshotsSection.module.css'

const screenshots = [
  { src: '/chat.png', alt: 'Интерфейс чата', label: 'Чат' },
  { src: '/login.png', alt: 'Страница входа', label: 'Авторизация' },
  { src: '/videoCall.png', alt: 'Видеозвонок', label: 'Видеозвонок' },
]

export default function ScreenshotsSection() {
  const [current, setCurrent] = useState(0)

  function prev() {
    setCurrent((i) => (i === 0 ? screenshots.length - 1 : i - 1))
  }

  function next() {
    setCurrent((i) => (i === screenshots.length - 1 ? 0 : i + 1))
  }

  const s = screenshots[current]

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Как это выглядит</h2>
      <div className={styles.carousel}>
        <button className={styles.arrow} onClick={prev}>←</button>
        <div className={styles.imageWrapper}>
          <Image
            src={s.src}
            alt={s.alt}
            width={1440}
            height={900}
            className={styles.image}
          />
        </div>
        <button className={styles.arrow} onClick={next}>→</button>
      </div>
      <p className={styles.label}>{s.label}</p>
      <div className={styles.dots}>
        {screenshots.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  )
}