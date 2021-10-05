export enum LOG_LEVEL {
  DEBUG = 0,
  INFO = 1,
  LOG = 2,
  WARN = 3,
  ERROR = 4
}

const isDev = process.env.NODE_ENV == 'development'
const defaultLogLevel = isDev ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN
const logLevel = parseInt(localStorage.getItem('LOG_LEVEL') || `${defaultLogLevel}`)


const getDate = (): string => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

export const debug = (...args: any) => {
  if (logLevel <= LOG_LEVEL.DEBUG) {
    console.log(`%c${getDate()}:`, 'color:#4444ff; font-weight:bold;', ...args);
  }
}

export const info = (...args: any) => {
  if (logLevel <= LOG_LEVEL.DEBUG) {
    console.info(`%c${getDate()}:`, 'color:green; font-weight:bold;', ...args);
  }
}

export const log = (...args: any) => {
  if (logLevel <= LOG_LEVEL.LOG) {
    console.log(`%c${getDate()}:`, 'font-weight:bold;', ...args);
  }
}

export const warn = (...args: any) => {
  if (logLevel <= LOG_LEVEL.WARN) {
    console.warn(`%c${getDate()}:`, 'font-weight:bold;', ...args);
  }
}

export const error = (...args: any) => {
  if (logLevel <= LOG_LEVEL.ERROR) {
    console.error(`${getDate()}: catched error:`);
    console.error(...args);
  }
}
