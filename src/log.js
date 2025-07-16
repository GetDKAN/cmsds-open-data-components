import isString from 'lodash/isString'
import find from 'lodash/find'
import toUpper from 'lodash/toUpper'
import toLower from 'lodash/toLower'
import findIndex from 'lodash/findIndex'
import config from './config/index'
import { isIeUserAgent } from './utilities/displayUtilities'

let { logLevel } = config

const userAgent = navigator.userAgent || ''
const isIE = isIeUserAgent(userAgent)

// force IE 11 to log errors only to prevent crashing the browser
logLevel = isIE ? 'ERROR' : toUpper(logLevel)

const levels = [
  {
    key: 'DEBUG',
    logFunc: console.log
  },
  {
    key: 'INFO',
    logFunc: console.info
  },
  {
    key: 'WARN',
    logFunc: console.warn
  },
  {
    key: 'ERROR',
    logFunc: console.error
  }
]

const logLevelObject = find(levels, { key: logLevel })
const logLevelIndex = logLevelObject
  ? findIndex(levels, { key: logLevel })
  : false
const allowedLevelKeys =
  logLevelIndex === false
    ? []
    : levels.slice(logLevelIndex, levels.length).map(({ key }) => key)

const log = ({ key, logFunc }) => (args) => {
  const prefix = `[${key}]`
  if (isString(args[0])) {
    args[0] = `${prefix} ${args[0]}`
  } else {
    args.push(prefix)
  }

  logFunc.apply(null, args)
}

const logger = {}

levels.forEach((level) => {
  const key = level.key
  logger[toLower(key)] = (...args) => {
    if (allowedLevelKeys.indexOf(key) > -1) {
      log(level)(args)
    }
  }
})

export default logger
