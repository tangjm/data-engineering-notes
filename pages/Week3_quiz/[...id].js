import Layout from "../../components/layout";
import Note from "../../components/note";
import { getNoteData, getNotes } from "../../lib/notes";

export async function getStaticPaths() {
  const week3QuizNotes = getNotes(["Week3_quiz", "quiz"])

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
    paths: createPaths("quiz", week3QuizNotes),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const subpaths = params.id;
  const note = await getNoteData("Week3_quiz", subpaths);

  return {
    props: {
      note
    }
  }
}

export default function week3QuizNote({ note }) {
  return (
    <Layout>
      <Note note={note} />
    </Layout>
  )
}