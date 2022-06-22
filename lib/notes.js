import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { isMarkdown } from './isMarkdown'

const rootDirectory = path.join(process.cwd(), "public");

/**
 * 
 * @param {string[]} A path array. e.g. ['abc', 'zzz'] would correspond to the path '/abc/zzz'
 * @returns {string[]} An array of markdown filenames at the specified path
 */
export function getNotes(subdirs) {
  const fileDirectory = path.join(rootDirectory, ...subdirs);
  const fileList = fs.readdirSync(fileDirectory);

  const markdownFiles = fileList.filter(file => isMarkdown(file));
  const fileNames = markdownFiles.map(file => file.replace(/\.md$/, ""));

  return fileNames;
}


/**
 * 
 * @param {string} subdir 
 * @param {string[]} paths 
 * @returns An object with 3 properties
 * 1. id: the name of the file
 * 2. metadata
 * 3. Content of the file as a HTML string
 */
export async function getNotesData(subdir, paths) {
  // add .md extension to filename
  let last = paths.length - 1;
  const id = paths[last];
  paths[last] = paths[last] + ".md";

  const filePath = path.join(rootDirectory, subdir, ...paths);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // gray-matter for parsing metadata
  const matterResult = matter(fileContents);

  const processedContents = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = String(processedContents);

  return {
    id,
    ...matterResult.data,
    contentHtml
  }
}