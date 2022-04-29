// This is the page that is rendered when users visit the root '/' of your application
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Data Engineering Notes</title>
        <meta name="description" content="Notes on data engineering" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Data Engineering Notes
        </h1>

        <p className={styles.description}>
          A collection of notes related to data engineering including AWS notes, Data warehousing notes, SQL learning logs (SQLHabit), NoSQL notes (MongoDB) and selected Quizzes
        </p>

        <div className={styles.grid}>
          <Link href="/sql">
            <a className={styles.card}>
              <h2>SQL</h2>
              <p>SQLHabit chapter notes, practice exercises and general notes</p>
            </a>
          </Link>

          <Link href="/aws">
            <a className={styles.card}>
              <h2>AWS</h2>
              <p>Notes on Amazon Web Services Cloud Practitioner</p>
            </a>
          </Link>

          <Link href="/talend">
            <a className={styles.card}>
              <h2>Talend Studio</h2>
              <p>Notes on Talend Studio and creating ETL Jobs</p>
            </a>
          </Link>

          <Link href="/other">
            <a className={styles.card}>
              <h2>Other notes</h2>
              <p>NoSQL, quizzes and data in the cloud</p>
            </a>
          </Link>
        </div>

        <div className={styles.grid}>
          <p><b>How these notes were made</b></p>
          <ol>
            <li>Take notes in markdown </li>
            <li>Use <a href="https://shd101wyy.github.io/markdown-preview-enhanced/#/">Markdown Preview Enhanced</a> VSCode plugin to export markdown files to static HTML files</li>
            <li>Stitch together static HTML files and serve them using <a href="https://nextjs.org/">NextJS</a> for Static Site Generation (SSG)</li>
          </ol>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
