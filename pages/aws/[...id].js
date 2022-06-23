import styles from '../../styles/Home.module.css';
import Layout from "../../components/layout";
import Head from "next/head";
import { getNotes, getNoteData } from "../../lib/notes";

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

export async function getStaticPaths() {
  let upperBound = Object.keys(subdirs).length
  // a list of integers that correspond to our AWS modules
  let moduleArr = []
  for (let i = 1; i <= upperBound; i++) {
    moduleArr.push(i)
  }

  // map integers an array of to objects containing subdirectory name and html file name
  // We want to concatenate ['AWS', 'moduleN'] with the array of markdown file names under moduleN/
  let filePaths2DArray = moduleArr.map(n => {
    let subdir = subdirs["module" + n];
    const files = getNotes(['AWS', subdir]);
    return files.map(file => {
      return {
        params: {
          id: [subdir, file]
        }
      }
    });
  })

  // [['AWS', 'module1', 'fileName'], ['AWS', 'module2', 'fileName2'], ...]
  // We need to return an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: ['moduleName', 'fileName']
  //     }
  //   }
  // ]
  return {
    paths: filePaths2DArray.flat(),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const subpaths = params.id;
  const note = await getNoteData("AWS", subpaths);
  return {
    props: {
      note
    }
  }
}

export default function awsNote({ note }) {
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
      </main>
    </Layout>
  )
}