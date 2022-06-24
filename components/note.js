import styles from '../styles/Home.module.css'
import noteStyles from '../styles/Note.module.css'
import Head from 'next/head';
import PropTypes from 'prop-types'

export default function Note({ note, children }) {
  return (
    <>
      <Head>
        <title>{note.id}</title>
        <meta name="description" content={note.id} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/prismjs@1.28.0/themes/prism-coy.min.css"
        // href="https://unpkg.com/prismjs@0.0.1/themes/prism.css"
        // href="https://unpkg.com/prismjs@0.0.1/themes/prism-tomorrow.css"
        // href="https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css"
        // href="https://unpkg.com/prismjs@1.28.0/themes/prism-solarizedlight.min.css"
        // href="https://unpkg.com/prismjs@1.28.0/themes/prism.min.css"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {note.id}
        </h1>
        <div className={noteStyles.container} dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
        {children}
      </main>
    </>
  )
}

Note.propTypes = {
  note: PropTypes.object.isRequired
}