type SearchDataset = {
  identifier: string;
  title: string;
  description: string;
  modified: string;
  theme: string[];
  keyword?: string[];
  '%Ref:distribution': Array<{
    identifier: string;
    data: { title: string; format: string; downloadURL: string };
  }>;
};

const buildDataset = (id: string, title: string, theme: string, modified: string): SearchDataset => ({
  identifier: id,
  title,
  description: `Sample description for ${title}.`,
  modified,
  theme: [theme],
  keyword: ['2025'],
  '%Ref:distribution': [
    {
      identifier: `${id}-dist`,
      data: {
        title: 'CSV Download',
        format: 'csv',
        downloadURL: `https://example.test/data/${id}.csv`,
      },
    },
  ],
});

export const makeSearchResults = (
  overrides: Partial<{
    total: number;
    results: Record<string, SearchDataset>;
    facets: Array<{ type: string; name: string; total: string }>;
  }> = {},
) => {
  const results = {
    'sample-001': buildDataset('sample-001', 'Quarterly Sales Report', 'Sales', '2025-01-15'),
    'sample-002': buildDataset('sample-002', 'Product Catalog', 'Inventory', '2025-02-01'),
    'sample-003': buildDataset('sample-003', 'Regional Distribution', 'Sales', '2025-02-12'),
  };
  return {
    total: Object.keys(results).length,
    results,
    facets: [
      { type: 'theme', name: 'Sales', total: '2' },
      { type: 'theme', name: 'Inventory', total: '1' },
      { type: 'keyword', name: '2025', total: '3' },
    ],
    ...overrides,
  };
};
