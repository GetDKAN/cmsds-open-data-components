import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useQuery } from '@tanstack/react-query';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import useMetastoreDataset from '../../services/useMetastoreDataset';
import useDatastore from '../../services/useDatastore';
import PageNotFound from '../PageNotFound';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import { Tabs, TabPanel } from '@cmsgov/design-system';
import SearchItemIcon from '../../assets/icons/searchItem';
import DatasetOverview from '../../components/DatasetOverviewTab';
import DatasetAPI from '../../components/DatasetAPITab';
import DataDictionary from '../../components/DatasetDataDictionaryTab';
import { DatasetDictionaryItemType, DatasetPageType, DatasetDictionaryType, DistributionType, ResourceType, ColumnType } from '../../types/dataset';
import TransformedDate from '../../components/TransformedDate';
import { getFormatType } from '../../utilities/format';
import './dataset.scss';
import DataTableStateWrapper from '../../components/DatasetTableTab/DataTableStateWrapper';
import DataTableContext from './DataTableContext';
import DatasetDescription from '../../components/DatasetDescription';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const getDataDictionary = (dataDictionaryUrl: string) => {
  const { ACA } = useContext(ACAContext);
  const { data, isPending, error } = useQuery({
    queryKey: ["dictionary" + dataDictionaryUrl],
    queryFn: () => {
      return fetch(`${dataDictionaryUrl}?${qs.stringify(acaToParams({}, ACA), { arrayFormat: 'comma', encode: false })}`).then(
        (res) => res.json(),
      )
    }
  });

  return {
    dataDictionary: data as DatasetDictionaryType,
    dataDictionaryLoading: isPending
  }
}

const Dataset = ({
  id,
  rootUrl,
  customColumns,
  setDatasetTitle,
  customMetadataMapping,
  apiPageUrl = "/api",
  dataDictionaryUrl,
  borderlessTabs = false,
  defaultPageSize = 25,
  dataDictionaryCSV = false,
  dataDictionaryBanner = false,
  disableTableControls = false,
  hideDataDictionary = false,
  customDescription,
  updateAriaLive,
  showRowLimitNotice = false
}: DatasetPageType) => {
  const options = location.search
    ? { ...qs.parse(location.search, { ignoreQueryPrefix: true }) }
    : { conditions: [] };

  const { dataset, isPending } = useMetastoreDataset(id, rootUrl);
  const title = dataset.title ? dataset.title : '';
  const metadataMapping = {
    ...defaultMetadataMapping,
    ...customMetadataMapping,
  };

  let distribution = {} as DistributionType;
  let distributions = dataset.distribution ? dataset.distribution : [];
  if (distributions.length) {
    distribution = distributions[0];
  }

  const resource = useDatastore(
    '',
    rootUrl,
    {
      ...options,
      limit: defaultPageSize,
    }
  ) as ResourceType;

  const siteWideDataDictionary = dataDictionaryUrl ? getDataDictionary(rootUrl + dataDictionaryUrl).dataDictionary : null;

  // compare schema fields with siteWideDataDictionary to display commonalities for now
  // until dataset level data dictionaries are implemented
  const datasetSitewideDictionary = (siteWideDataDictionary && siteWideDataDictionary.data && siteWideDataDictionary.data.fields && resource && resource.schema[distribution.identifier]) ?
    siteWideDataDictionary.data.fields.filter((field: DatasetDictionaryItemType) => {
      return Object.keys(resource.schema[distribution.identifier].fields).indexOf(field.name) !== -1;
    }) : null;

  useEffect(() => {
    const localFileFormat = getFormatType(distribution);
    if (localFileFormat === 'csv') {
      resource.setResource(distribution.identifier);
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
      <h1 className="ds-text-heading--4xl">Error: Dataset not found</h1>
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


  // The below code manages the selected tab in the Design System tab group manually to ensure we can still use the
  // Data Table tab as the default since it no longer exists on initial render (By default, Overview will appear as default)
  const getDefaultTab = () => {
    return (getFormatType(distribution) === "csv") ? "data-table" : "overview";
  }
  const [selectedTab, setSelectedTab] = useState(
    window.location.hash.substring(1) ? window.location.hash.substring(1) : getDefaultTab())

  useEffect(() => {
    if (!window.location.hash.substring(1))
      setSelectedTab(getDefaultTab())
    else if (window.location.hash.substring(1) != selectedTab)
      setSelectedTab(window.location.hash.substring(1))
  }, [distribution, window.location.hash])

  const displayDataDictionaryTab = ((distribution.data && distribution.data.describedBy && distribution.data.describedByType === 'application/vnd.tableschema+json') || (datasetSitewideDictionary && datasetSitewideDictionary.length > 0)) as boolean;
  const formatType = getFormatType(distribution);

  return (
    <>
      {dataset.error ? (
        <PageNotFound content={notFoundContent} siteUrl={rootUrl} />
      ) : (
        <div className={'ds-l-container'}>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--9'}>
              <h1 className="ds-text-heading--3xl">{title}</h1>
            </div>
            <div className={'ds-l-md-col--12 ds-u-margin-y--1 ds-u-text-align--right'}>
              <p className="ds-u-margin--0">Updated <TransformedDate date={dataset.modified} /></p>
            </div>
            <div className={'ds-l-md-col--9'}>
              <DatasetDescription
                distribution={distribution}
                dataset={dataset}
                resource={resource}
                customDescription={customDescription}
                updateAriaLive={updateAriaLive}
              />
            </div>
          </div>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--12 dc-dataset'}>
              {!isPending && (
                <Tabs
                  onChange={(selectedId, prevSelectedId) => {
                    setSelectedTab(selectedId)
                  }}
                  selectedId={selectedTab}
                >
                  <TabPanel
                    id={'data-table'}
                    tab={
                      <span className="ds-u-color--primary">
                        <SearchItemIcon id="data-table" />
                        Data Table
                      </span>
                    }
                    className={borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : ''}
                  >
                    {getFormatType(distribution) === "csv"
                      ? (
                        <DataTableContext.Provider value={{
                          id: id,
                          resource: resource,
                          distribution: distribution,
                          rootUrl: rootUrl,
                          customColumns: customColumns,
                          dataDictionaryBanner: (dataDictionaryBanner && displayDataDictionaryTab),
                          datasetTableControls: !disableTableControls
                        }}>
                          <DataTableStateWrapper />
                        </DataTableContext.Provider>
                      ) : (
                        <p>There is no Data Table associated with this dataset. Data Tables will only display for CSV files</p>
                      )
                    }
                  </TabPanel>
                  <TabPanel
                    id={'overview'}
                    tab={
                      <span className="ds-u-color--primary">
                        <SearchItemIcon id="overview" />
                        Overview
                      </span>
                    }
                    className={borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : ''}
                  >
                    <DatasetOverview resource={resource} dataset={dataset} distributions={distributions} metadataMapping={metadataMapping} />
                  </TabPanel>
                  {!hideDataDictionary && (
                    <TabPanel
                      id={'data-dictionary'}
                      tab={
                        <span className="ds-u-color--primary">
                          <SearchItemIcon id="data-dictionary" />
                          Data Dictionary
                        </span>
                      }
                      className={borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : ''}
                    >
                      {displayDataDictionaryTab
                        ? (
                          <DataDictionary
                            datasetSitewideDictionary={datasetSitewideDictionary}
                            datasetDictionaryEndpoint={distribution.data.describedBy}
                            title={"Data Dictionary"}
                            csvDownload={dataDictionaryCSV}
                          />
                        ) : (
                          <p>There is no Data Dictionary associated with this dataset.</p>
                        )}
                    </TabPanel>
                  )}
                  {distribution && distribution.data && (
                    <TabPanel
                      id={'api'}
                      tab={
                        <span className="ds-u-color--primary">
                          <SearchItemIcon id="api" />
                          API
                        </span>
                      }
                      className={borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : ''}
                    >
                      <DatasetAPI id={id} rootUrl={rootUrl} apiUrl={apiPageUrl} showRowLimitNotice={showRowLimitNotice} />
                    </TabPanel>
                  )}
                </Tabs>
              )}
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
