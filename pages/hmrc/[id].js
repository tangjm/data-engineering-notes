import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import Layout from '../../components/layout.js'
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
        <div dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
        <br />
        <br />
        {note.id === "gvms_data" &&
          <iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVOq5Glxk=/?moveToViewport=-1132,-581,2377,1127" frameBorder="0" scrolling="no" allowFullScreen></iframe>}
      </main>
    </Layout>
  )
}