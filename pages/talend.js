import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/Head'
import Image from 'next/Image'

export default function awsNotes() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Talend notes</title>
        <meta name="description" content="Talend notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Talend notes
        </h1>

        <p className={styles.description}>

        </p>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}