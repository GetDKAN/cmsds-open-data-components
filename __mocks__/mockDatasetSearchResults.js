// Mock dataset search results for Storybook stories
// Simulates the response from the /search/ API endpoint

export const mockDatasets = {
  'dataset-1': {
    identifier: 'dataset-1',
    title: 'Medicare Provider Utilization and Payment Data',
    modified: '2024-03-15T14:30:00',
  },
  'dataset-2': {
    identifier: 'dataset-2',
    title: 'Hospital Compare National Data',
    modified: '2024-03-10T09:15:00',
  },
  'dataset-3': {
    identifier: 'dataset-3',
    title: 'Medicare Part D Prescriber Data',
    modified: '2024-03-05T16:45:00',
  },
  'dataset-4': {
    identifier: 'dataset-4',
    title: 'Nursing Home Compare Data',
    modified: '2024-02-28T11:20:00',
  },
  'dataset-5': {
    identifier: 'dataset-5',
    title: 'Home Health Compare Data',
    modified: '2024-02-25T13:10:00',
  },
  'dataset-6': {
    identifier: 'dataset-6',
    title: 'Medicare Inpatient Hospitals Data',
    modified: '2024-02-20T10:05:00',
  },
  'dataset-7': {
    identifier: 'dataset-7',
    title: 'Physician Compare National Downloadable File',
    modified: '2024-02-15T14:55:00',
  },
  'dataset-8': {
    identifier: 'dataset-8',
    title: 'Medicare Outpatient Hospitals Data',
    modified: '2024-02-10T08:30:00',
  },
  'dataset-9': {
    identifier: 'dataset-9',
    title: 'Medicare Spending Per Beneficiary',
    modified: '2024-02-05T15:25:00',
  },
  'dataset-10': {
    identifier: 'dataset-10',
    title: 'Hospital Readmissions Reduction Program',
    modified: '2024-01-30T12:40:00',
  },
  'dataset-11': {
    identifier: 'dataset-11',
    title: 'Medicare Advantage Enrollment Data',
    modified: '2024-01-25T09:50:00',
  },
  'dataset-12': {
    identifier: 'dataset-12',
    title: 'Medicare Part D Drug Spending',
    modified: '2024-01-20T16:15:00',
  },
  'dataset-13': {
    identifier: 'dataset-13',
    title: 'Medicare Fee-for-Service Provider Data',
    modified: '2024-01-15T11:35:00',
  },
  'dataset-14': {
    identifier: 'dataset-14',
    title: 'Medicare Geographic Variation Data',
    modified: '2024-01-10T14:20:00',
  },
  'dataset-15': {
    identifier: 'dataset-15',
    title: 'Medicare Chronic Conditions Data',
    modified: '2024-01-05T10:45:00',
  },
  'dataset-16': {
    identifier: 'dataset-16',
    title: 'Medicare Beneficiary Summary File',
    modified: '2023-12-30T13:55:00',
  },
  'dataset-17': {
    identifier: 'dataset-17',
    title: 'Medicare Provider Enrollment Data',
    modified: '2023-12-25T09:30:00',
  },
  'dataset-18': {
    identifier: 'dataset-18',
    title: 'Medicare Claims Data',
    modified: '2023-12-20T15:10:00',
  },
  'dataset-19': {
    identifier: 'dataset-19',
    title: 'Medicare Quality Measures Data',
    modified: '2023-12-15T11:25:00',
  },
  'dataset-20': {
    identifier: 'dataset-20',
    title: 'Medicare Cost Report Data',
    modified: '2023-12-10T08:40:00',
  },
  'dataset-21': {
    identifier: 'dataset-21',
    title: 'Medicare Shared Savings Program Data',
    modified: '2023-12-05T14:50:00',
  },
  'dataset-22': {
    identifier: 'dataset-22',
    title: 'Medicare Hospital Value-Based Purchasing',
    modified: '2023-11-30T10:15:00',
  },
  'dataset-23': {
    identifier: 'dataset-23',
    title: 'Medicare Ambulatory Surgical Center Data',
    modified: '2023-11-25T16:30:00',
  },
  'dataset-24': {
    identifier: 'dataset-24',
    title: 'Medicare Dialysis Facility Compare Data',
    modified: '2023-11-20T12:45:00',
  },
  'dataset-25': {
    identifier: 'dataset-25',
    title: 'Medicare Hospice Compare Data',
    modified: '2023-11-15T09:20:00',
  },
};

export const mockApiResponse = {
  total: 25,
  results: mockDatasets,
};

export const mockSmallDatasetList = {
  total: 3,
  results: {
    'dataset-1': mockDatasets['dataset-1'],
    'dataset-2': mockDatasets['dataset-2'],
    'dataset-3': mockDatasets['dataset-3'],
  },
};

export const mockEmptyResults = {
  total: 0,
  results: {},
};
