import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Layout from '../components/layout'
import { getNotes } from '../lib/notes'
import { removeExtension } from '../lib/removeExtension'
import { createNotesLinks, createNotesLinksSingleParent } from '../lib/createNotesLinks'

const createLinksMongoDb = createNotesLinks('NoSQL', removeExtension);
const createLinksWeek3Quiz = createNotesLinks('Week3_quiz', removeExtension);
const createLinksHMRC = createNotesLinksSingleParent('hmrc', removeExtension);

export async function getStaticProps() {
  const mongodbNotes = getNotes(['NoSQL', 'MongoDB'])
  const week3quizNotes = getNotes(['Week3_quiz', 'quiz'])
  const hmrcNotes = getNotes(['HMRC'])

  return {
    props: {
      mongodbNotes,
      week3quizNotes,
      hmrcNotes
    }
  }
}

export default function otherNotes({ mongodbNotes, week3quizNotes, hmrcNotes }) {
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

        <div className={styles.containerFlex}>
          <div className={styles.item2}>
            <h2>Brexit and GVMS</h2>
            <p>Notes on Brexit and GVMS</p>
            <ol>
              {createLinksHMRC(hmrcNotes)}
            </ol>
          </div>

          <div className={styles.item2}>
            <h2>MongoDB</h2>
            <p>Notes on MongoDB</p>
            <ol>
              {createLinksMongoDb('MongoDB', mongodbNotes)}
            </ol>
          </div>

          <div className={styles.item2}>
            <h2>Week 3 Quiz</h2>
            <p>A quiz on SQL, MongoDB and Cloud computing</p>
            <ol>
              {createLinksWeek3Quiz('quiz', week3quizNotes)}
            </ol>
          </div>
        </div>
      </main>
    </Layout>
  )
}