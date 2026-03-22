import styles from './HeroSection.module.css'

const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL ?? 'http://192.168.1.113:5173/';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Мессенджер в <span className={styles.accent}>реальном времени</span>
      </h1>
      <p className={styles.subtitle}>
        Текстовые и голосовые сообщения, онлайн-статусы,
        JWT-авторизация и WebSocket синхронизация
      </p>
      <a href={chatUrl} className={styles.cta} target="_blank" rel="noopener noreferrer">Начать общение</a>
    </section>
  )
}