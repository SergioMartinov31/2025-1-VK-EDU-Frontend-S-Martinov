import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'О проекте — SimpleChat',
  description: 'Как устроен мессенджер SimpleChat изнутри',
}

async function getGithubProfile() {
  const res = await fetch('https://api.github.com/users/SergioMartinov31', {
    next: { revalidate: 3600 } 
  })
  return res.json()
}

export default async function AboutPage() {
  const github = await getGithubProfile()

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>О проекте</h1>
      <p className={styles.text}>
        SimpleChat — учебный fullstack мессенджер. Фронтенд на React + Redux Toolkit,
        бэкенд на Node.js/Express, реалтайм через Socket.IO.
      </p>

      <div className={styles.github}>
        <img src={github.avatar_url} width={64} height={64} style={{borderRadius: '50%'}} />
        <div>
          <p className={styles.githubName}>{github.name}</p>
          <p className={styles.githubStats}>
            Репозиториев: {github.public_repos} · 
            Подписчиков: {github.followers}
          </p>
          <a href={github.html_url} target="_blank" rel="noopener noreferrer">
            Открыть GitHub →
          </a>
        </div>
      </div>

      <Link href="/" className={styles.back}>← На главную</Link>
    </main>
  )
}