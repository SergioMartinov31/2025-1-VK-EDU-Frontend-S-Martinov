import styles from './FeaturesSection.module.css'

const features = [
  {
    icon: '⚡',
    title: 'Реальное время',
    desc: 'Сообщения приходят мгновенно через WebSocket (Socket.IO)',
  },
  {
    icon: '🎙️',
    title: 'Голосовые сообщения',
    desc: 'Запись прямо в браузере через MediaRecorder API',
  },
  {
    icon: '🟢',
    title: 'Онлайн-статусы',
    desc: 'Видишь кто сейчас в сети в режиме реального времени',
  },
  {
    icon: '🔐',
    title: 'JWT-авторизация',
    desc: 'Безопасная аутентификация с токенами на каждый запрос',
  },
]

export default function Features() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Возможности</h2>
      <div className={styles.grid}>
        {features.map((f) => (
          <div key={f.title} className={styles.card}>
            <span className={styles.icon}>{f.icon}</span>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}