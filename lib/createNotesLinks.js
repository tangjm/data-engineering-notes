import Link from 'next/link'
import styles from '../styles/Home.module.css'


/**
 * 
 * @param {string} parentDir name of immediate child directory of the `public` directory
 * @param {function} fileFormatter function that removes the file extension from a string
 * @returns A function that expects 
 * 1. a subdirectory name
 * 2. an array of html files.
 */
export function createNotesLinks(parentDir, fileFormatter) {
  return function using(subdir, notes) {
    return notes.map(note => {
      return <li className={styles.itemFont} key={note}>
        <Link href={`/${parentDir}/${subdir}/${note}`}>
          {fileFormatter(note)}
        </Link>
      </li>
    })
  }
}

export function createNotesLinksSingleParent(parentDir, fileFormatter) {
  return function using(notes) {
    return notes.map(note => {
      return <li className={styles.itemFont} key={note}>
        <Link href={`/${parentDir}/${note}`}>
          <a>
            {fileFormatter(note)}
          </a>
        </Link>
      </li>
    })
  }
}
