import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout.js'
import { getNotes } from '../lib/getNotes';
import { removeExtension } from '../lib/removeExtension.js'
import { createNotesLinks } from '../lib/createNotesLinks.js'

function helper(str) {
  let num = str.split('exercise')[1];
  return num;
}

function sortNumerical(x, y) {
  let x1 = parseInt(helper(x));
  let y1 = parseInt(helper(y));
  if (x1 < y1) return -1;
  else if (x1 === y1) return 0;
  else return 1;
}

const createLinks = createNotesLinks('SQL', removeExtension);

export async function getStaticPaths() {
  const generalNotes = getNotes(["SQL", "notes"]);
  const chapterNotes = getNotes(["SQL", "chapters"]);
  const exerciseNotes = getNotes(["SQL", "exercises"]);
  const postgresNotes = getNotes(["SQL", "postgres"]);

  // We need to return an array that looks like this
  // [
  //   {
  //     params: {
  //       id: ['notes', generalNotes[i]]
  //     }
  //   }, 
  //   {
  //     params: {
  //       id: ['notes', generalNotes[i + 1]]
  //     }
  //   },
  //   {
  //     params: {
  //       id: ['chapters', chaptersNotes[i]]
  //     }
  //   },
  //   ...
  // ]


  function createPaths(subdir, notes) {
    return notes.map(note => {
      return {
        params: {
          id: [subdir, note]
        }
      }
    });
  }

  return [
    ...createPaths("notes", generalNotes),
    ...createPaths("chapters", chapterNotes),
    ...createPaths("exercises", exerciseNotes),
    ...createPaths("postgres", postgresNotes)
  ]
}

// export async function getStaticProps() {
//   const generalNotes = getNotes(...['SQL', 'notes'])
//   const chapterNotes = getNotes(...['SQL', 'chapters']).sort()
//   const exerciseNotes = getNotes(...['SQL', 'exercises']).sort(sortNumerical)
//   const postgresNotes = getNotes(...['SQL', 'postgres'])

//   return {
//     props: {
//       generalNotes,
//       chapterNotes,
//       exerciseNotes,
//       postgresNotes
//     }
//   }
// }

export default function sqlNotes({ generalNotes, chapterNotes, exerciseNotes, postgresNotes }) {
  return (
    <>
      <Head>
        <title>SQL Notes</title>
        <meta name="description" content="SQL Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SQL Notes
        </h1>

        <div className={styles.containerFlex}>
          <div className={styles.item2}>
            <h2>SQLHabit Exercises</h2>
            <p>Solutions and plans to SQLHabit practice questions with detailed explanations where appropriate</p>
            <ul>
              {createLinks('exercises', exerciseNotes)}
            </ul>
          </div>

          <div className={styles.item2}>
            <h2>General SQL notes</h2>
            <p>Mostly covering high-level concepts, syntax and selected topics</p>
            <ul>
              {createLinks('notes', generalNotes)}
            </ul>
          </div>

          <div className={styles.item2}>
            <h2>SQLHabit chapter notes</h2>
            <p>A learning log on selected chapters from the SQLHabit course</p>
            <ul>
              {createLinks('chapters', chapterNotes)}
            </ul>
          </div>

          <div className={styles.item2}>
            <h2>Postgres notes</h2>
            <p>Some useful notes on working with Postgres</p>
            <ul>
              {createLinks('postgres', postgresNotes)}
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}

sqlNotes.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}