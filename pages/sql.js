import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import { getNotes } from '../lib/getNotes';

function removeExtension(note) {
  return note.slice(0, note.length - 5);
}

function createLinksNotes(subdir, notes) {
  return notes.map(note => {
    return <li key={note}>
      <Link href={`/SQL/${subdir}/${note}`}>{removeExtension(note)}</Link>
    </li>
  })
}

export async function getStaticProps() {
  const generalNotes = getNotes(...['SQL', 'notes'])
  const chapterNotes = getNotes(...['SQL', 'chapters'])
  const exerciseNotes = getNotes(...['SQL', 'exercises'])
  const postgresNotes = getNotes(...['SQL', 'postgres'])

  return {
    props: {
      generalNotes,
      chapterNotes,
      exerciseNotes,
      postgresNotes
    }
  }
}


export default function sqlNotes({ generalNotes, chapterNotes, exerciseNotes, postgresNotes }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>SQL Notes</title>
        <meta name="description" content="SQL Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          SQL Notes
        </h1>

        <h2>SQLHabit Exercises</h2>
        <p>Solutions and plans to SQLHabit practice questions with detailed explanations where appropriate</p>
        <ul>
          {createLinksNotes('exercises', exerciseNotes)}
        </ul>

        <h2>General SQL notes</h2>
        <p>Mostly covering high-level concepts, syntax and selected topics</p>
        <ul>
          {createLinksNotes('notes', generalNotes)}
        </ul>

        <h2>SQLHabit chapter notes</h2>
        <p>A learning log on selected chapters from the SQLHabit course</p>
        <ul>
          {createLinksNotes('chapters', chapterNotes)}
        </ul>

        <h2>Postgres notes</h2>
        <p>Some useful notes on working with Postgres</p>
        <ul>
          {createLinksNotes('postgres', postgresNotes)}
        </ul>
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