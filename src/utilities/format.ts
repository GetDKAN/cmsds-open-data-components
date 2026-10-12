import { DistributionType } from "../types/dataset";

export function getFormatType(dist: DistributionType) {
  if (dist) {
    if(dist.format) {
      return  dist.format.toLowerCase()
    }
    if(dist.mediaType) {
      const mediaType = dist.mediaType.split('/');
      if (mediaType.length && mediaType[1]) {
        return mediaType[1].toLowerCase();
      }
    }
    // Some distributions have neither format nor mediaType; use the file extension
    if (dist.downloadURL) {
      const extension = getPathname(dist.downloadURL).match(/\.([a-z0-9]+)$/i);
      if (extension) {
        return extension[1].toLowerCase();
      }
    }
  }
  return '';
}

function getPathname(url: string) {
  try {
    return new URL(url, 'http://localhost').pathname;
  } catch {
    return url.split(/[?#]/)[0];
  }
}