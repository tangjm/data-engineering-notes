import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import { getNotes } from '../lib/getNotes.js'
import { removeExtension } from '../lib/removeExtension.js'

function createLinksNotes(parentDir, subdir, notes) {
  return notes.map(note => {
    return <li key={note}>
      <Link href={`/${parentDir}/${subdir}/${note}`}>{removeExtension(note)}</Link>
    </li>
  })
}

export async function getStaticProps() {
  const mongodbNotes = getNotes(...['NoSQL', 'MongoDB'])
  const week3quizNotes = getNotes(...['Week3_quiz', 'quiz'])
  return {
    props: {
      mongodbNotes,
      week3quizNotes
    }
  }
}

export default function awsNotes({ mongodbNotes, week3quizNotes }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Other notes</title>
        <meta name="description" content="Other notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Other notes
        </h1>

        <div className={styles.description}>
          <h2>MongoDB</h2>
          <p>Notes on MongoDB</p>
          <ol>
            {createLinksNotes('NoSQL', 'MongoDB', mongodbNotes)}
          </ol>

          <br></br>

          <h2>Week 3 Quiz</h2>
          <p>A quiz on SQL, MongoDB and Cloud computing</p>
          <ol>
            {createLinksNotes('Week3_quiz', 'quiz', week3quizNotes)}
          </ol>
        </div>

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