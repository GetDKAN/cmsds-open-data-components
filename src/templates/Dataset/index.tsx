import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import qs from 'qs';
import { useQuery } from '@tanstack/react-query';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import useMetastoreDataset from '../../services/useMetastoreDataset';
import useDatastore from '../../services/useDatastore';
import PageNotFound from '../PageNotFound';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import { Tabs, TabPanel } from '@cmsgov/design-system';
import SearchItemIcon from '../../assets/icons/searchItem';
import DatasetTable from '../../components/DatasetTableTab';
import DatasetOverview from '../../components/DatasetOverviewTab';
import DatasetAPI from '../../components/DatasetAPITab';
import DataDictionary from '../../components/DatasetDataDictionaryTab';
import { DatasetDictionaryItemType, DatasetPageType, DatasetDictionaryType, DistributionType, ResourceType } from '../../types/dataset';
import './dataset.scss';

const getSiteWideDataDictionary = (rootUrl : string, dataDictionaryUrl : string) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ["dictionary"],
    queryFn: () => {
      return fetch(rootUrl + dataDictionaryUrl).then(
        (res) => res.json(),
      )
    }
  });

  return {
    siteWideDataDictionary: data as DatasetDictionaryType,
    dataDictionaryLoading: isLoading
  }
}

const Dataset = ({
  id,
  rootUrl,
  additionalParams,
  customColumns,
  setDatasetTitle,
  customMetadataMapping,
  apiPageUrl = "/api",
  dataDictionaryUrl,
} : DatasetPageType) => {
  const options = location.search
    ? { ...qs.parse(location.search, { ignoreQueryPrefix: true }) }
    : { conditions: [] };

  const { dataset } = useMetastoreDataset(id, rootUrl, additionalParams);
  const title = dataset.title ? dataset.title : '';
  const metadataMapping = {
    ...defaultMetadataMapping,
    ...customMetadataMapping,
  };

  let distribution = {} as DistributionType;
  let distributions= dataset.distribution ? dataset.distribution : [];
  if (distributions.length) {
    distribution = distributions[0];
  }

  const resource = useDatastore(
    '',
    rootUrl,
    {
      ...options,
      limit: 25,
      manual: true,
    },
    additionalParams
  ) as ResourceType;

  const { siteWideDataDictionary } = dataDictionaryUrl ? getSiteWideDataDictionary(rootUrl, dataDictionaryUrl) : { siteWideDataDictionary: null};
  console.log(siteWideDataDictionary)

  // compare schema fields with siteWideDataDictionary to display commonalities for now
  // until dataset level data dictionaries are implemented
  const datasetDictionary = (siteWideDataDictionary && resource && resource.schema[distribution.identifier]) ?
    siteWideDataDictionary.data.fields.filter((field : DatasetDictionaryItemType) => {
      return Object.keys(resource.schema[distribution.identifier].fields).indexOf(field.name) !== -1;
    }) : null;
  console.log(datasetDictionary)
    

  useEffect(() => {
    if (distribution.identifier) {
      resource.setResource(distribution.identifier);
      resource.setManual(false);
    }
  }, [distribution]);

  useEffect(() => {
    if (title) {
      if (setDatasetTitle) {
        setDatasetTitle(title);
      }
    }
  }, [title]);

  const notFoundContent = (
    <div className="ds-u-padding-top--3">
      <h1 className="ds-title">Error: Dataset not found</h1>
      <p>
        We're sorry, but there is no dataset ID that matches your entry. You may have been directed
        here because:
      </p>
      <ol>
        <li>The address you typed contains a typo;</li>
        <li>The requested dataset no longer exists.</li>
      </ol>
      <p>
        <span className="ds-u-font-weight--bold">Note:</span> If you were using a bookmark, please
        reset it once you find the correct dataset.
      </p>
    </div>
  );
  return (
    <>
      {dataset.error ? (
        <PageNotFound content={notFoundContent} siteUrl={rootUrl} />
      ) : (
        <div className={'ds-l-container'}>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--9'}>
              <h1 className={'ds-u-margin-bottom--7 ds-h1 title-underline'}>{title}</h1>
              <div className={'ds-u-measure--wide ds-u-margin-bottom--7'}>
                <p className="dc-c-metadata-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dataset.description) }}/>
              </div>
            </div>
          </div>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--12 dc-dataset'}>
              <Tabs
                onChange={function noRefCheck() {}}
                defaultSelectedId={window.location.hash.substring(1)}
              >
                <TabPanel
                  id={'data-table'}
                  tab={
                    <span>
                      <SearchItemIcon id="data-table" />
                      Data Table
                    </span>
                  }
                >
                  <DatasetTable id={id} distribution={distribution} resource={resource} rootUrl={rootUrl} customColumns={customColumns} />
                </TabPanel>
                <TabPanel
                  id={'overview'}
                  tab={
                    <span>
                      <SearchItemIcon id="overview" />
                      Overview
                    </span>
                  }
                >
                  <DatasetOverview resource={resource} dataset={dataset} distributions={distributions} metadataMapping={metadataMapping} />
                </TabPanel>
                { datasetDictionary && datasetDictionary.length && (
                  <TabPanel
                    id={'data-dictionary'}
                    tab={
                      <span>
                        <SearchItemIcon id="data-dictionary" />
                        Data Dictionary
                      </span>
                    }
                  >
                    <DataDictionary datasetDictionary={datasetDictionary} title={"Data Dictionary"} />
                  </TabPanel>
                )}
                <TabPanel
                  id={'api'}
                  tab={
                    <span>
                      <SearchItemIcon id="api" />
                      API
                    </span>
                  }
                >
                  <DatasetAPI id={id} rootUrl={rootUrl} apiUrl={apiPageUrl} />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Dataset.propTypes = {
  id: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
};

export default withQueryProvider(Dataset);
