import Layout from "../../components/layout";
import Note from "../../components/note";
import { getNoteData, getNotes } from "../../lib/notes";

export async function getStaticPaths() {
  const mongoDbNotes = getNotes(["NoSQL", "MongoDB"])

  // [
  //   {
  //     params: {
  //       id: ["MongoDB", mongoDBNotes[i]]
  //     }
  //   }
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
    paths: createPaths("MongoDB", mongoDbNotes),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const subpaths = params.id;
  const note = await getNoteData("NoSQL", subpaths);

  return {
    props: {
      note
    }
  }
}

export default function mongoDbNote({ note }) {
  return (
    <Layout>
      <Note note={note} />
    </Layout>
  )
}