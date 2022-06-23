import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import Layout from '../../components/layout.js'
import { removeExtension } from '../../lib/removeExtension.js'
import { createNotesLinks } from '../../lib/createNotesLinks.js'
import { getNotes, getNoteData } from '../../lib/notes';

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

  return {
    paths: [
      ...createPaths("notes", generalNotes),
      ...createPaths("chapters", chapterNotes),
      ...createPaths("exercises", exerciseNotes),
      ...createPaths("postgres", postgresNotes)
    ],
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const subpaths = params.id;
  const note = await getNoteData("SQL", subpaths);

  return {
    props: {
      note
    }
  }
}

export default function sqlNotes({ note }) {
  return (
    <Layout>
      <Head>
        <title>{note.id}</title>
        <meta name="description" content={note.id} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {note.id}
        </h1>
        <div dangerouslySetInnerHTML={{__html: note.contentHtml}}/>
      </main>
    </Layout>
  )
}