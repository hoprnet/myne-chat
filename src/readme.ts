import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export async function getReadme() {
  const readmePath = join(process.cwd(), 'README.md')
  const fileContents = fs.readFileSync(readmePath, 'utf8')
  const { content } = matter(fileContents)
  return (await remark().use(html, { sanitize: true }).process(content)).value
}