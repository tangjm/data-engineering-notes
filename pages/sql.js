import Link from 'next/Link'
import styles from '../styles/Home.module.css'
import Head from 'next/Head'
import Image from 'next/Image'
import { getNotes } from '../lib/sqlNotes';

function sqlLinks() {
  let arr = [];
  for (let i = 106; i <= 244; i++) {
    arr.push(i)
  }
  return arr.map(chapt => {
    let chapter = "CH" + chapt
    return <li>
      <Link href={`/SQL/SQLHabitChapters/${chapter}.html`}>{chapter}</Link>
    </li>
  })
}

function sqlExerciseNotes(notes) {
  return notes.map(note => {
    return <li>
      <Link href={`/SQL/exercises/${note}`}>{note.slice(0, note.length - 5)}</Link>
    </li>
  })
}

export async function getStaticProps() {
  const notes = getNotes(...['SQL', 'exercises'])
  return {
    props: {
      notes
    }
  }
}


export default function sqlNotes({ notes }) {
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

        <h2>Exercises</h2>
        <Link href="/SQL/exercises/exercise10.html">SQLHabit Exercises</Link>

        <h2>General notes</h2>
        <Link href="/SQL/notes/having_clause.html">The HAVING clause</Link>
        <ul>
          {sqlExerciseNotes(notes)}
          {sqlLinks()}
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