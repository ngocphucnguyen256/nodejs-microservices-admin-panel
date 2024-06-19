import winston from 'winston'
import fs from 'fs-extra'
import path from 'path'

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'magenta',
    info: 'green',
    verbose: 'cyan',
    silly: 'grey'
  }
}

winston.addColors(config.colors)

const ensureLogDirectoryExists = (logPath: string) => {
  const dir = path.dirname(logPath)
  fs.ensureDirSync(dir)
}

const handleTime = (time: Date) => {
  if (!time) {
    time = new Date()
  }
  return new Date(time).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLog = (info: winston.Logform.TransformableInfo) => {
  return `${handleTime(info.timestamp)} ${info.level.toLocaleUpperCase()}: ${info.message}`
}

const createLogger = (input: { logName: string; level: string }): winston.Logger => {
  const logDir = `./src/logs/${input.logName}`
  ensureLogDirectoryExists(logDir)

  return winston.createLogger({
    levels: config.levels,
    level: `${input.level}`,
    transports: [
      new winston.transports.Console({
        level: `${input.level}`,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(handleLog),
          winston.format.colorize({ all: true })
        )
      }),
      new winston.transports.File({
        filename: path.join(logDir, `${input.logName}-Error.log`),
        level: 'error',
        format: winston.format.printf(handleLog)
      }),
      new winston.transports.File({
        filename: path.join(logDir, `${input.logName}-Warn.log`),
        level: 'warn',
        format: winston.format.printf(handleLog)
      }),
      new winston.transports.File({
        filename: path.join(logDir, `${input.logName}-All.log`),
        level: 'silly',
        format: winston.format.printf(handleLog)
      }),
      new winston.transports.File({
        filename: './src/logs/globalLog.log',
        level: 'silly',
        format: winston.format.printf(handleLog)
      })
    ]
  })
}

export { createLogger }
