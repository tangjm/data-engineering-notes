import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout.js'
import { getNotes } from '../lib/getNotes.js'
import { removeExtension } from '../lib/removeExtension.js'
import { createNotesLinks } from '../lib/createNotesLinks.js'

const createLinks = createNotesLinks('NoSQL', removeExtension);
const createLinksWeek3Quiz = createNotesLinks('Week3_quiz', removeExtension);

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

export default function otherNotes({ mongodbNotes, week3quizNotes }) {
  return (
    <Layout>
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
            {createLinks('MongoDB', mongodbNotes)}
          </ol>

          <br></br>

          <h2>Week 3 Quiz</h2>
          <p>A quiz on SQL, MongoDB and Cloud computing</p>
          <ol>
            {createLinksWeek3Quiz('quiz', week3quizNotes)}
          </ol>
        </div>
      </main>
    </Layout>
  )
}