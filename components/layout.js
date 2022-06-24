import Image from 'next/image'
import Link from 'next/link'
import React from 'react';
import styles from '../styles/Home.module.css'

const pages = ["home", "aws", "sql", "talend", "other"];

function format(str) {
  function capitaliseFirst(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
  }
  
  switch(str) {
    case "aws":
    case "sql":
      return str.toUpperCase();
    default:
      return capitaliseFirst(str);
  }
}

function generateLink(page) {
  return page === "home" ? "" : page;
}

function generateNavLinks(pages) {
  const linksArray = pages.map(page => {
    let path = generateLink(page);
    return (
      <Link href={`/${path}`} key={page} passHref>
        <a>
          <h2>{format(page)}</h2>
        </a>
      </Link>
    )
  })
  return linksArray;
}

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      {children}

      <footer className={styles.footer}>
        {/* <div className={styles.containerSpread}> */}
        {generateNavLinks(pages)}
        {/* </div> */}
        <br></br>
          <span className={styles.logo}>
          Powered by{' '}
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>

      </footer>
    </div>
  )
}