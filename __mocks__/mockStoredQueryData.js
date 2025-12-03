// Mock dataset metadata and datastore records for StoredQueryPage stories

export const mockDatasetMetadata = {
  identifier: 'provider-utilization-2023',
  title: 'Medicare Provider Utilization and Payment Data 2023',
  description: 'This dataset provides information on services and procedures provided to Medicare beneficiaries by physicians and other healthcare professionals.',
  modified: '2024-03-15T14:30:00',
  distribution: [
    {
      identifier: 'csv-resource-123',
      data: {
        downloadURL: 'https://data.cms.gov/data/provider-utilization-2023.csv',
        format: 'csv',
        title: 'Medicare Provider Utilization CSV',
      },
    },
  ],
};

export const mockDatastoreRecords = {
  results: [
    {
      npi: '1234567890',
      provider_name: 'Smith, John',
      specialty: 'Internal Medicine',
      state: 'CA',
      total_services: 1250,
      total_beneficiaries: 450,
      total_payment: 125000.50,
    },
    {
      npi: '2345678901',
      provider_name: 'Johnson, Mary',
      specialty: 'Cardiology',
      state: 'NY',
      total_services: 980,
      total_beneficiaries: 320,
      total_payment: 98500.75,
    },
    {
      npi: '3456789012',
      provider_name: 'Williams, Robert',
      specialty: 'Family Practice',
      state: 'TX',
      total_services: 2100,
      total_beneficiaries: 680,
      total_payment: 157300.25,
    },
    {
      npi: '4567890123',
      provider_name: 'Brown, Patricia',
      specialty: 'Pediatrics',
      state: 'FL',
      total_services: 1550,
      total_beneficiaries: 520,
      total_payment: 112400.00,
    },
  ],
  count: 4,
  schema: {
    'csv-resource-123': {
      fields: {
        npi: {
          type: 'string',
          mysql_type: 'varchar(10)',
          description: 'National Provider Identifier',
        },
        provider_name: {
          type: 'string',
          mysql_type: 'text',
          description: 'Provider last name, first name',
        },
        specialty: {
          type: 'string',
          mysql_type: 'text',
          description: 'Provider specialty description',
        },
        state: {
          type: 'string',
          mysql_type: 'varchar(2)',
          description: 'Provider state abbreviation',
        },
        total_services: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of services provided',
        },
        total_beneficiaries: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of unique beneficiaries',
        },
        total_payment: {
          type: 'number',
          mysql_type: 'decimal(12,2)',
          description: 'Total Medicare payment amount',
        },
      },
    },
  },
};

// Dataset with CA-only filtered results
export const mockFilteredDatastoreRecords = {
  results: [
    {
      npi: '1234567890',
      provider_name: 'Smith, John',
      specialty: 'Internal Medicine',
      state: 'CA',
      total_services: 1250,
      total_beneficiaries: 450,
      total_payment: 125000.50,
    },
    {
      npi: '5678901234',
      provider_name: 'Davis, Jennifer',
      specialty: 'Dermatology',
      state: 'CA',
      total_services: 780,
      total_beneficiaries: 290,
      total_payment: 89200.00,
    },
  ],
  count: 2,
  schema: {
    'csv-resource-123': {
      fields: {
        npi: {
          type: 'string',
          mysql_type: 'varchar(10)',
          description: 'National Provider Identifier',
        },
        provider_name: {
          type: 'string',
          mysql_type: 'text',
          description: 'Provider last name, first name',
        },
        specialty: {
          type: 'string',
          mysql_type: 'text',
          description: 'Provider specialty description',
        },
        state: {
          type: 'string',
          mysql_type: 'varchar(2)',
          description: 'Provider state abbreviation',
        },
        total_services: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of services provided',
        },
        total_beneficiaries: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of unique beneficiaries',
        },
        total_payment: {
          type: 'number',
          mysql_type: 'decimal(12,2)',
          description: 'Total Medicare payment amount',
        },
      },
    },
  },
};

// Large dataset for pagination testing (50+ rows)
export const mockLargeDatastoreRecords = {
  results: Array.from({ length: 50 }, (_, i) => ({
    npi: `${1000000000 + i}`,
    provider_name: `Provider ${i + 1}`,
    specialty: ['Internal Medicine', 'Cardiology', 'Family Practice', 'Pediatrics', 'Dermatology'][i % 5],
    state: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH'][i % 7],
    total_services: 500 + (i * 50),
    total_beneficiaries: 200 + (i * 20),
    total_payment: 50000 + (i * 1000),
  })),
  count: 50,
  schema: {
    'csv-resource-123': {
      fields: {
        npi: {
          type: 'string',
          mysql_type: 'varchar(10)',
          description: 'National Provider Identifier',
        },
        provider_name: {
          type: 'string',
          mysql_type: 'text',
          description: 'Provider last name, first name',
        },
        specialty: {
          type: 'string',
          mysql_type: 'text',
          description: 'Provider specialty description',
        },
        state: {
          type: 'string',
          mysql_type: 'varchar(2)',
          description: 'Provider state abbreviation',
        },
        total_services: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of services provided',
        },
        total_beneficiaries: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of unique beneficiaries',
        },
        total_payment: {
          type: 'number',
          mysql_type: 'decimal(12,2)',
          description: 'Total Medicare payment amount',
        },
      },
    },
  },
};

// Dataset with multiple distributions
export const mockMultiDistributionDataset = {
  identifier: 'provider-utilization-2023',
  title: 'Medicare Provider Utilization and Payment Data 2023',
  description: 'This dataset provides information on services and procedures provided to Medicare beneficiaries.',
  modified: '2024-03-15T14:30:00',
  distribution: [
    {
      identifier: 'csv-resource-123',
      data: {
        downloadURL: 'https://data.cms.gov/data/provider-utilization-2023.csv',
        format: 'csv',
        title: 'Medicare Provider Utilization CSV',
      },
    },
    {
      identifier: 'csv-resource-456',
      data: {
        downloadURL: 'https://data.cms.gov/data/provider-utilization-2023-summary.csv',
        format: 'csv',
        title: 'Medicare Provider Utilization Summary CSV',
      },
    },
  ],
};

export const mockSecondDistributionRecords = {
  results: [
    {
      state: 'CA',
      total_providers: 15000,
      avg_payment: 125000,
    },
    {
      state: 'NY',
      total_providers: 12000,
      avg_payment: 115000,
    },
    {
      state: 'TX',
      total_providers: 11000,
      avg_payment: 105000,
    },
  ],
  count: 3,
  schema: {
    'csv-resource-456': {
      fields: {
        state: {
          type: 'string',
          mysql_type: 'varchar(2)',
          description: 'State abbreviation',
        },
        total_providers: {
          type: 'integer',
          mysql_type: 'int',
          description: 'Total number of providers',
        },
        avg_payment: {
          type: 'number',
          mysql_type: 'decimal(12,2)',
          description: 'Average payment amount',
        },
      },
    },
  },
};
