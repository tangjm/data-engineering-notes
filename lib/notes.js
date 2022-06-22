import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';


// /**
//  * 
//  * @param  {...String} pathArray e.g. ['abc', 'zzz'] would correspond to the path '/abc/zzz'
//  * @returns {String[]} An array of HTML filenames at the specified path
//  */
// export function getNotes(...pathArray) {
//   const fileDirectory = path.join(process.cwd(), 'public', ...pathArray)
//   const fileList = fs.readdirSync(fileDirectory)
//   const htmlFiles = fileList.filter(file => {
//     let charArr = file.split('.')
//     let extension = charArr[charArr.length - 1];
//     return extension === 'html'
//   })
//   return htmlFiles
// }

const rootDirectory = path.join(process.cwd(), "public");

export function getNotes(subdirs) {
  const fileDirectory = path.join(rootDirectory, ...subdirs);
  const fileList = fs.readdirSync(fileDirectory);

  const markdownFiles = fileList.filter(file => isMarkdown(file));
  const fileNames = markdownFiles.map(file => file.replace(/\.md$/, ""));

  return fileNames;
}



export async function getNotesData(subdir, paths) {
  // add .md extension to filename
  let last = paths.length - 1;
  paths[last] = paths[last] + ".md";

  const filePath = path.join(rootDirectory, subdir, paths);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // gray-matter for parsing metadata
  const matterResult = matter(fileContents);

  const processedContents = await remark()
    .use(html)
    .process(matterResult.content);
  
  const contentHtml = String(processedContents);

  return {
    id: paths[last],
    ...matterResult.data,
    contentHtml
  }

}