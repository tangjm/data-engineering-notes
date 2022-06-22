import path from 'path';
import fs from 'fs';


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

