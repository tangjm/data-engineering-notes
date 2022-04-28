import Link from 'next/link'



function sqlLinks() {
  let arr = [];
  for (let i = 106; i <= 244; i++) {
    arr.push(i)
  }
  return arr.map(chapt => {
    let chapter = "CH" + chapt
    return <li>
      <Link href={`/SQL/SQLHabitChapters/${chapter}.html`}>{chapter}</Link>
      </li>
  })
}

export default function sqlNotes() {
  return (
    <ul>
      {sqlLinks()}
    </ul>
  )
}