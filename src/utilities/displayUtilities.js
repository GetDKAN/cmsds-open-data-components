import some from 'lodash/some'

const internetExplorerUserAgentStrings = [
  'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0;',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0;',
  'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;'
]

/**
 * Determine if userAgent is a mobile device; this is not ideal to have on
 * the frontend, but this method can be updated with more regex as needed
 * @param {string} userAgent
 */
export const isMobileDevice = (userAgent = '') => {
  const match = !!(
    userAgent.match(/Android/i) ||
    userAgent.match(/webOS/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPod/i) ||
    userAgent.match(/BlackBerry/i)
  )

  return match
}

/**
 * Determine if userAgent is an IE browser; probably not 100% accurate, but it's IE, so.... ¯\_(ツ)_/¯
 * @param {string} userAgent
 */
export const isIeUserAgent = (userAgent) => {
  return some(
    internetExplorerUserAgentStrings,
    (ieUaString) => userAgent.indexOf(ieUaString) > -1
  )
}
