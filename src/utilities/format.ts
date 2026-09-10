import { DistributionType } from "../types/dataset";

export function getFormatType(dist : DistributionType) {
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
    if(dist["%Ref:downloadURL"] && dist["%Ref:downloadURL"].length && dist["%Ref:downloadURL"][0].data) {
      if(dist["%Ref:downloadURL"][0].data.mimeType) {
        const mimeType = dist["%Ref:downloadURL"][0].data.mimeType.split("/");
        if (mimeType.length && mimeType[1]) {
          return mimeType[1].toLowerCase();
        }
      }
    }
  }
  return '';
}