import toNumber from 'lodash/toNumber'
import isNumber from 'lodash/isNumber'

export const formatBytes = (bytes = 0) => {
  if (!isNumber(bytes)) bytes = toNumber(bytes)

  const k = 1000
  const doNotRenderBytes = true

  if (!doNotRenderBytes && bytes === 0) {
    return {
      sizeLabel: 'BYTES',
      size: 0
    }
  }

  /*
    Return 1KB if bytes is less than 1000
    This used to set size to 0 but that doesn't make sense when there is an actual file size
    We decided to set size to 1 instead
  */
  if (doNotRenderBytes && bytes < k) {
    return {
      sizeLabel: 'KB',
      size: 1
    }
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    sizeLabel: sizes[i],
    size: parseFloat((bytes / Math.pow(k, i)).toFixed(0))
  }
}
