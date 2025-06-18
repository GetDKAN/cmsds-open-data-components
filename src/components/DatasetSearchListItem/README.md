# DatasetSearchListItem Component

A TypeScript React component for displaying dataset search results with support for themes, dates, and navigation.

## Props

```typescript
type SearchItemProps = {
  title: string;                    // Dataset title
  modified: string;                 // Modified date
  description: string;              // Dataset description
  identifier: string;               // Dataset identifier
  downloadUrl?: string | null;      // Download URL (optional)
  largeFile: boolean;               // Whether file is large
  paginationEnabled: boolean;       // Whether pagination is enabled
  dataDictionaryLinks: boolean;     // Whether to show data dictionary links
  refresh?: string;                 // Refresh date (optional)
  released?: string;                // Released date (optional)
  showTopics?: boolean;             // Whether to show themes (default: false)
  showDateDetails?: boolean;        // Whether to show detailed dates (default: false)
  theme?: string[];                 // Array of theme strings (optional)
  location: LocationType;           // Current location object (required)
}
```

## Location Type

```typescript
type LocationType = {
  pathname: string;                 // Current pathname (required)
  search?: string;                  // Search query (optional)
  hash?: string;                    // Hash fragment (optional)
  state?: any;                      // Location state (optional)
};
```

## Usage Examples

### Basic Usage

```tsx
import { DatasetSearchListItem } from '@civicactions/cmsds-open-data-components';

const location = {
  pathname: '/search',
  search: '?q=healthcare',
  hash: '',
  state: null
};

<DatasetSearchListItem
  title="Healthcare Dataset"
  modified="2023-01-01"
  description="Healthcare related data"
  identifier="healthcare-123"
  largeFile={false}
  paginationEnabled={true}
  dataDictionaryLinks={true}
  location={location}
/>
```

### With Themes

```tsx
const themeData = ['Healthcare', 'Medicare'];

<DatasetSearchListItem
  title="Medicare Dataset"
  modified="2023-01-01"
  description="Medicare related data"
  identifier="medicare-456"
  largeFile={false}
  paginationEnabled={true}
  dataDictionaryLinks={true}
  showTopics={true}
  theme={themeData}
  location={location}
/>
```

### With Date Details

```tsx
<DatasetSearchListItem
  title="Dataset with Dates"
  modified="2023-01-01"
  description="Dataset with multiple dates"
  identifier="dates-789"
  largeFile={false}
  paginationEnabled={true}
  dataDictionaryLinks={true}
  showDateDetails={true}
  refresh="2023-02-01"
  released="2022-12-01"
  location={location}
/>
```

### With Download

```tsx
<DatasetSearchListItem
  title="Downloadable Dataset"
  modified="2023-01-01"
  description="Dataset with download link"
  identifier="download-123"
  largeFile={false}
  paginationEnabled={true}
  dataDictionaryLinks={true}
  downloadUrl="https://example.com/data.csv"
  location={location}
/>
```

## Features

- **Theme Display**: Shows clickable theme tags when `showTopics` is true
- **Date Handling**: Supports modified, released, and refresh dates
- **Download Support**: Handles both regular and large file downloads
- **Navigation**: Proper state management for theme links
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: ARIA labels and proper semantic structure
- **TypeScript**: Full type safety with proper interfaces

## Styling

The component uses CSS modules and includes styling for:
- Theme tags with pill-style design
- Responsive layout
- Hover and focus states
- Design system integration 