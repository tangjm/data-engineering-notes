import Layout from '../../components/layout.js'
import Note from '../../components/note';
import { getNotes, getNoteData } from '../../lib/notes';

export async function getStaticPaths() {
  const hmrcNotes = getNotes(["HMRC"]);

  // We need to return an array that looks like this
  // [
  //   {
  //     params: {
  //       id: hmrcNotes[i]
  //     }
  //   },
  //   ...
  // ]

  const dynamicPaths = hmrcNotes.map(note => {
    return {
      params: {
        id: note
      }
    }
  })
  return {
    paths: dynamicPaths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const subpaths = params.id;
  const note = await getNoteData("HMRC", [subpaths]);

  return {
    props: {
      note
    }
  }
}

export default function hmrcNote({ note }) {

  const extraData = (
    <>
      <h3>GVMS User Journey</h3>
      <br />
      <br />
      <iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVOq5Glxk=/?moveToViewport=-1132,-581,2377,1127" frameBorder="0" scrolling="no" allowFullScreen></iframe>
    </>
  );

  return (
    <Layout>
      <Note note={note}>
        {note.id === "gvms_data" && extraData}
      </Note>
    </Layout>
  )
}