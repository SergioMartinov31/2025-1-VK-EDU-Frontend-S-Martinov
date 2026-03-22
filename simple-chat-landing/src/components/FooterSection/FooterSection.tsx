import styles from './FooterSection.module.css'

export default function FooterSection() {
  return (
    <footer className={styles.footer}>
      <p>SimpleChat</p>
      <a
        href="https://github.com/SergioMartinov31/2025-1-VK-EDU-Frontend-S-Martinov"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub →
      </a>
    </footer>
  )
}