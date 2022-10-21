import fs from 'fs'

const files = process.argv.slice(2)

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  try {
    JSON.parse(content)
  } catch (err) {
    console.error(err)
    console.error('invalid format: ' + file)
  }
}
