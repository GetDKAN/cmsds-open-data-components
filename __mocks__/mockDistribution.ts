import { DistributionType } from '../src/types/dataset';

export const mockDistribution: DistributionType = {
  "identifier": "32da6993-e045-59e4-823e-a5c2c56c649c",
  "data": {
    "@type": "dcat:Distribution",
    "title": "Registration Completion List for 2016- Present",
    "description": " ",
    "format": "csv",
    "mediaType": "text/csv",
    "downloadURL": "https://data.healthcare.gov/sites/default/files/uploaded_resources/TBL_RCL_380.csv",
    "describedBy": "https://data.healthcare.gov/api/1/metastore/schemas/data-dictionary/items/22ad17f4-1b4d-4382-b940-79bddc8bb610",
    "describedByType": "application/vnd.tableschema+json",
    "%Ref:downloadURL": [{
      "identifier": "95e89ec51666a390f472c018137db2d5__1779112050__source",
      "data": {
        "filePath": "https://h-o.st/sites/default/files/uploaded_resources/TBL_RCL_380.csv",
        "identifier": "95e89ec51666a390f472c018137db2d5",
        "mimeType": "text/csv",
        "perspective": "source",
        "version": "1779112050",
        "checksum": null
      }
    }]
  }
}
