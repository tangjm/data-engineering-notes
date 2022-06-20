import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { getNotes } from '../lib/getNotes.js'
import { removeExtension } from '../lib/removeExtension.js'

function createLinksNotes(subdir, notes) {
  return notes.map(note => {
    return <li key={note}>
      <Link href={`/Talend/${subdir}/${note}`}>{removeExtension(note)}</Link>
    </li>
  })
}

export async function getStaticProps() {
  const basicsNotes = getNotes(...['Talend', 'basics'])
  const advancedNotes = getNotes(...['Talend', 'advanced'])
  return {
    props: {
      basicsNotes,
      advancedNotes
    }
  }
}

export default function talendNotes({ basicsNotes, advancedNotes }) {
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

        <div className={styles.containerFlex}>
          <div className={styles.item3}>
            <h2>Data Integration Basics</h2>
            <ul>
              {createLinksNotes('basics', basicsNotes)}
            </ul>
          </div>
          <div className={styles.item3}>
            <h2>Data Integration Advanced</h2>
            <ul>
              {createLinksNotes('advanced', advancedNotes)}
            </ul>
          </div>

        </div>

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