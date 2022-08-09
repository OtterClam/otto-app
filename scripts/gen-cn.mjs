import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'
import OpenCC from 'opencc-js'

const converter = OpenCC.Converter({ from: 'tw', to: 'cn' })
const inputFile = process.argv[2]
const outputFile = inputFile.replace('zh-tw', 'zh-cn')
const outputFolder = path.dirname(outputFile)

const fileContent = fs.readFileSync(inputFile, 'utf8')
const convertedFileContent = converter(fileContent)

fs.mkdirSync(outputFolder, { recursive: true })
fs.writeFileSync(outputFile, convertedFileContent)

execSync(`git add ${outputFile}`)
