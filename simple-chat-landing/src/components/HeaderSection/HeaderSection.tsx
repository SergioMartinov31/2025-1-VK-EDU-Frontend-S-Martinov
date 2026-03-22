import Link from 'next/link'
import styles from './HeaderSection.module.css'

const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL ?? 'http://192.168.1.113:5173/';

export default function HeaderSection() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>💬 SimpleChat</Link>
      <nav className={styles.nav}>
        <Link href="/about">О проекте</Link>
        <a href={chatUrl} className={styles.button} target="_blank" rel="noopener noreferrer">
          Открыть чат →
        </a>
      </nav>
    </header>
  )
}