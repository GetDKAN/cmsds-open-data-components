import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import FontAwesomePro from '../FontAwesomePro/FontAwesomePro';
import { formatBytes } from '../../../utilities/downloadUtilities';
import { pdcAxiosInstance } from '../../../api/axiosInstance';
import log from '../../../log';
import DatasetDownloadLink from '../../dataset/DatasetDownloadLink/DatasetDownloadLink';
import { getApiBaseUrl } from '../../../utilities/getApiBaseUrl';
import { FilteredDispatch } from '../../DatasetResource/FilteredDatasetContext';

function FileDownload(props) {
  const { resource, isDatasetExplorerDownloadLink = false } = props;
  let downloadURL = null;

  const { downloadSize, setDownloadSize } = useContext(FilteredDispatch);

  if (
    Object.prototype.hasOwnProperty.call(resource, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data.data, 'downloadURL')
  ) {
    const fixedURL = getApiBaseUrl(false);
    downloadURL = `${fixedURL}${resource.data.data.downloadURL.split('/provider-data')[1]}`;
  }

  let format = null;

  if (
    Object.prototype.hasOwnProperty.call(resource, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data, 'format')
  ) {
    format = resource.data.format;
    format.toUpperCase();
  }

  let title = null;
  if (
    Object.prototype.hasOwnProperty.call(resource, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data.data, 'title')
  ) {
    title = resource.data.data.title;
  } else {
    title = 'This Dataset';
  }

  useEffect(() => {
    if (downloadURL) {
      pdcAxiosInstance
        .head(downloadURL)
        .then(({ headers }) => {
          const cLength = headers['content-length'];
          setDownloadSize(formatBytes(cLength));
        })
        .catch((e) => {
          log.debug('Error retrieving fileSize, FileDownload: ', e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadURL]);

  const item = (
    <>
      {downloadURL && title && format && (
        <DatasetDownloadLink
          linkText={
            <>
              <FontAwesomePro icon="download" aria-hidden />
              {isDatasetExplorerDownloadLink ? (
                <span>
                  Download full dataset ({format.toUpperCase()}){' '}
                  {`${downloadSize.size} ${downloadSize.sizeLabel}`}
                </span>
              ) : (
                <span>
                  Download full dataset{' '}
                  <span className="sr-only">
                    - {format} - {`${downloadSize.size} ${downloadSize.sizeLabel}`}
                  </span>
                </span>
              )}
            </>
          }
          linkHref={downloadURL}
        />
      )}
      {!isDatasetExplorerDownloadLink && (
        <div className="format">
          <span className="format-inner">{format}</span>
          {downloadSize && (
            <>
              <span className="bullet-point">&bull;</span>
              <span>{`${downloadSize.size} ${downloadSize.sizeLabel}`}</span>
            </>
          )}
        </div>
      )}
    </>
  );

  return isDatasetExplorerDownloadLink ? item : <div className="resource">{item}</div>;
}

FileDownload.propTypes = {
  /**
   * Dataset data object
   */
  resource: PropTypes.shape({
    data: PropTypes.object,
    format: PropTypes.string,
    identifier: PropTypes.string,
  }),
  /**
   * Dataset explorer download link gets different styling
   */
  isDatasetExplorerDownloadLink: PropTypes.bool,
};
FileDownload.displayName = 'FileDownload';
export default FileDownload;
