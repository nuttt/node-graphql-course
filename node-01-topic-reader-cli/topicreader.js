const fs = require('fs')
const path = require('path')

const util = require('util')
const readFile = util.promisify(fs.readFile)

const read = async (topicId) => {
  const txtPath = path.join(__dirname, 'topic-mock', `${topicId}.txt`)
  const buffer = await readFile(txtPath)
  const txt = buffer.toString()
  const lines = txt.split('\n')
  return {
    title: lines[0],
    content: lines.slice(1).join('\n')
  }
}

module.exports = { read }
