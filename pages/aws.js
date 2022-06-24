import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Layout from '../components/layout'
import { getNotes } from '../lib/notes'
import { removeExtension } from '../lib/removeExtension'
import { createNotesLinks } from '../lib/createNotesLinks'
import React from 'react'

const createLinks = createNotesLinks('aws', removeExtension);

const moduleNamesAws = [
  null,
  "Module 1: The Cloud",
  "Module 2: Economics",
  "Module 3: AWS Infrastructure",
  "Module 4: Cloud security",
  "Module 5: Networking",
  "Module 6: Compute Services",
  "Module 7: Storage services",
  "Module 8: Database services",
  "Module 9: Cloud Architecture",
  "Module 10: Auto scaling and Monitoring",
]

const subdirs = {
  "module1": "module1_cloud_concepts",
  "module2": "module2_cloud_economics_billing",
  "module3": "module3_global_infrastructure",
  "module4": "module4_cloud_security",
  "module5": "module5_networking",
  "module6": "module6_compute",
  "module7": "module7_storage",
  "module8": "module8_database",
  "module9": "module9_cloud_architecture",
  "module10": "module10_auto_scaling_and_monitoring"
}

export async function getStaticProps() {
  let upperBound = Object.keys(subdirs).length
  // a list of integers that correspond to our AWS modules
  let moduleArr = []
  for (let i = 1; i <= upperBound; i++) {
    moduleArr.push(i)
  }

  // map integers to objects containing subdirectory name and html file name
  let awsNotes = moduleArr.map(n => {
    let subdir = subdirs["module" + n];
    return {
      id: n,
      subdir,
      fileName: getNotes(['AWS', subdir])
    }
  })

  return {
    props: {
      modules: awsNotes
    }
  }
}

export default function awsNotes({ modules }) {
  return (
    <Layout>
      <Head>
        <title>AWS Notes</title>
        <meta name="description" content="AWS Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          AWS Notes
        </h1>
        <h2>AWS Academy Cloud Foundations</h2>
        <div>
          {modules.map(module => {
            return <React.Fragment key={module.id}>
              <h2>{moduleNamesAws[module.id]}</h2>
              <ul>
                {createLinks(module.subdir, module.fileName)}
              </ul>
            </React.Fragment>
          })}
        </div>
      </main>
    </Layout>
  )
}