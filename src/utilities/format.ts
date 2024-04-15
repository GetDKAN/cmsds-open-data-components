import { DistributionType } from "../types/dataset";

export function getFormatType(dist : DistributionType) {
  if (dist && dist.data) {
    if(dist.data.format) {
      return  dist.data.format.toLowerCase()
    }
    if(dist.data.mediaType) {
      const mediaType = dist.data.mediaType.split('/');
      if (mediaType.length && mediaType[1]) {
        return mediaType[1].toLowerCase();
      }
    }
    if(dist.data["%Ref:downloadURL"].length && dist.data["%Ref:downloadURL"][0].data) {
      if(dist.data["%Ref:downloadURL"][0].data.mimeType) {
        const mimeType = dist.data["%Ref:downloadURL"][0].data.mimeType.split("/");
        if (mimeType.length && mimeType[1]) {
          return mimeType[1].toLowerCase();
        }
      }
    }
  }
  return '';
}