export const resourceData = {
  data: {
    identifier: '11745687-dc47-52ac-b9e4-66c50fe772ad',
    data: {
      '@type': 'dcat:Distribution',
      title: 'Test Data abcd 0016',
      downloadURL: 'https://pqdc-dkan.ddev.site/provider-data/sites/default/files/resources/f69b073f217ea35ed14997178f7085c8_1677006237/Test_Data_abcd_0016.csv',
      mediaType: 'text/csv',
      '%Ref:downloadURL': [
        {
          identifier: 'f69b073f217ea35ed14997178f7085c8__1677006237__source',
          data: {
            filePath: 's3://913461122956-pdc-dev-test-minimal-data/Test_Data_abcd_0016.csv',
            identifier: 'f69b073f217ea35ed14997178f7085c8',
            mimeType: 'text/csv',
            perspective: 'source',
            version: '1677006237',
            checksum: null
          }
        },
        {
          identifier: 'f69b073f217ea35ed14997178f7085c8__1677006237__local_url',
          data: {
            filePath: 'http://h-o.st/provider-data/sites/default/files/resources/f69b073f217ea35ed14997178f7085c8_1677006237/Test_Data_abcd_0016.csv',
            identifier: 'f69b073f217ea35ed14997178f7085c8',
            mimeType: 'text/csv',
            perspective: 'local_url',
            version: '1677006237',
            checksum: null
          }
        }
      ]
    },
    format: 'csv'
  }
}

export const responseHeaders = {
  'content-length': 99999
}
