'use strict'

const fs = require('fs')
const path = require('path')

const tokenPath = path.join(__dirname, 'data', 'token.txt')

function readBotToken() {
  let contents
  try {
    contents = fs.readFileSync(tokenPath, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Bot token file is missing. Create data/token.txt and paste the Discord bot token into it.')
    }
    throw new Error(`Could not read data/token.txt: ${error.message}`)
  }

  const token = contents.trim()
  if (!token) {
    throw new Error('data/token.txt is empty. Paste the Discord bot token into the file as plain text.')
  }
  if (/\s/.test(token)) {
    throw new Error('data/token.txt contains whitespace inside the token. It must contain only the plain Discord bot token.')
  }
  return token
}

module.exports = {
  readBotToken,
  tokenPath
}
