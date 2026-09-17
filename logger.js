'use strict'

const fs = require('fs')
const path = require('path')

const loggerStateKey = Symbol.for('discord-app-builder.console-logger')

function localDateKey(date = new Date()) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function reserveRunFile(logDirectory) {
  fs.mkdirSync(logDirectory, { recursive: true })
  const date = localDateKey()
  let run = 1

  while (true) {
    const logFile = path.join(logDirectory, `${date}_${run}.log`)
    try {
      const descriptor = fs.openSync(logFile, 'wx')
      fs.closeSync(descriptor)
      return logFile
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
      run += 1
    }
  }
}

function installConsoleLogger() {
  if (global[loggerStateKey]) return global[loggerStateKey]

  const inheritedLogFile = process.env.DAB_LOG_FILE
  const logFile = inheritedLogFile
    ? path.resolve(inheritedLogFile)
    : reserveRunFile(path.join(__dirname, 'log'))

  fs.mkdirSync(path.dirname(logFile), { recursive: true })
  process.env.DAB_LOG_FILE = logFile

  const streams = [process.stdout, process.stderr]
  const originalWrites = streams.map(stream => stream.write.bind(stream))

  streams.forEach((stream, index) => {
    const originalWrite = originalWrites[index]
    stream.write = function writeAndLog(chunk, encoding, callback) {
      const result = originalWrite(chunk, encoding, callback)
      try {
        const data = Buffer.isBuffer(chunk)
          ? chunk
          : Buffer.from(String(chunk), typeof encoding === 'string' ? encoding : 'utf8')
        fs.appendFileSync(logFile, data)
      } catch (error) {
        originalWrites[1](`[Logger] Could not write to ${logFile}: ${error.message}\n`)
      }
      return result
    }
  })

  const state = {
    logFile,
    restore() {
      streams.forEach((stream, index) => {
        stream.write = originalWrites[index]
      })
      delete global[loggerStateKey]
    }
  }
  global[loggerStateKey] = state

  console.log(`[Logger] Writing console output to ${path.relative(__dirname, logFile)}`)
  return state
}

module.exports = {
  installConsoleLogger,
  localDateKey
}
