import { render, screen } from '@testing-library/react'
import FilteredDownload from './FilteredDownload'
import { resourceData } from '../../../utilities/data-mocks/data-fileDownload'
import { MemoryRouter } from 'react-router-dom'

describe('FilteredDownload component.', () => {
  it('Matches snapshot.', () => {
    const renderedFilteredDownload = render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/',
          search: '',
          hash: '',
          state: {
            fromTitle: '',
            fromUrl: ''
          },
          key: 'abc123'
        }]}
      >
        <FilteredDownload
          resource={resourceData}
          datasetTitle='Home Health Care - Measure Date Range'
          filteredURL='https://pqdc-dkan.ddev.site/provider-data/api/1/pdc/query/test-data-abcd-0005/0/download?conditions%5B0%5D%5Bproperty%5D=col5&conditions%5B0%5D%5Boperator%5D=is_empty&conditions%5B0%5D%5Bvalue%5D=&properties=1-2-3-4-5-6&format=csv'
        />
      </MemoryRouter>
    )

    expect(renderedFilteredDownload.asFragment()).toMatchSnapshot()
  })

  it('Does not render download link if resource prop data is not provided.', () => {
    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/',
          search: '',
          hash: '',
          state: {
            fromTitle: '',
            fromUrl: ''
          },
          key: 'abc123'
        }]}
      >
        <FilteredDownload resource={{}} />
      </MemoryRouter>
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
