import Layout from '../../components/layout.js'
import Note from '../../components/note'
import { getNotes, getNoteData } from '../../lib/notes';

export async function getStaticPaths() {
  const generalNotes = getNotes(["SQL", "notes"]);
  const chapterNotes = getNotes(["SQL", "chapters"])
  const exerciseNotes = getNotes(["SQL", "exercises"])
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
      <Note note={note} />
    </Layout>
  )
}