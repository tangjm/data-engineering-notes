import Note from "../../components/note";
import Layout from "../../components/layout";
import { getNotes, getNoteData } from "../../lib/notes";

export async function getStaticPaths() {
  const talendBasicsNotes = getNotes(["Talend", "basics"])
  const talendAdvancedNotes = getNotes(["Talend", "advanced"])

  // [
  //   {
  //     params: {
  //       id: ["basics", talendBasicsNotes[i]]
  //     }
  //   },
  //   {
  //     params: {
  //       id: ["advanced", talendAdvancedNotes[i]]
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
    paths: [
      ...createPaths("basics", talendBasicsNotes),
      ...createPaths("advanced", talendAdvancedNotes)
    ],
    fallback: false
  }

}

export async function getStaticProps({ params }) {
  const subpaths = params.id;
  const talendNote = await getNoteData("Talend", subpaths);

  return {
    props: {
      note: talendNote
    }
  }
}

export default function talendNote({ note }) {
  return (
    <Layout>
      <Note note={note} />
    </Layout>
  )
}