import config from '../config/index'
import toLower from 'lodash/toLower'

export const getApiBaseUrl = (withApiPath = true) => {
  const { site, apiSite, domainsNeedProviderDataPath } = config
  const { protocol, hostname } = window.location
  const reactAppEnv = 'development'
  let baseUrl

  // Add 'provider-data/' to the base url for a certain set of domains
  const providerDataPath = ''//domainsNeedProviderDataPath.includes(hostname) ? 'provider-data/' : ''

  if (reactAppEnv === 'development') { // development environment only
    // site and apiSite values already have full domains included in the dev config file
    baseUrl = withApiPath ? apiSite : site.replace(/\/+$/, '')
  } else { // All other environments
    baseUrl = `${protocol}//${hostname}${withApiPath ? `/${providerDataPath}${apiSite}` : `/${providerDataPath}`}`
    baseUrl = baseUrl.replace(/\/+$/g, '')
  }

  return baseUrl
}
