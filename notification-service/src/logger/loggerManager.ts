// loggerManager.ts
import { createLogger } from './config'
import winston from 'winston'

class LoggerManager {
  private loggers: Map<string, winston.Logger> = new Map()

  public getLogger(logName: string, level = 'info'): winston.Logger {
    const key = `${logName}-${level}`
    if (!this.loggers.has(key)) {
      const logger = createLogger({ logName, level })
      this.loggers.set(key, logger)
    }
    return this.loggers.get(key) as winston.Logger
  }
}

const loggerManager = new LoggerManager()
export default loggerManager
