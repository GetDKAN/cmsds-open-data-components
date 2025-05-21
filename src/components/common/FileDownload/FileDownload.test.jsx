import { render, screen } from '@testing-library/react'
import FileDownload from './FileDownload'
import { act } from '@testing-library/react'
import { resourceData, responseHeaders } from '../../../utilities/data-mocks/data-fileDownload'
import axiosMockAdapter from '../../../stories/utilities/axios-mock'
import log from '../../../log'
import { FilteredDispatch } from '../../dataset/DatasetResource/FilteredDatasetContext'
import { MemoryRouter } from 'react-router-dom'

// Mock the config file
vi.mock('../../../../config', () => ({
  default: {
    site: "https://pqdc-dkan.ddev.site/",
    domainsNeedProviderDataPath: []
  }
}))

// Mock window.location
global.window = Object.create(window)
Object.defineProperty(window, 'location', {
  value: {
     protocol: 'http:',
     hostname: 'localhost'
  },
  writable: true
})

const componentArgs = {
  resource: resourceData,
  isDatasetExplorerDownloadLink: false
}


const renderComponent = (args = componentArgs) => (
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
      <FilteredDispatch.Provider
        value={{
          downloadSize: {
            size: 10,
            sizeLabel: 'KB'
          }
        }}
      >
        <FileDownload {...args} />
      </FilteredDispatch.Provider>
    </MemoryRouter>
  )
)

describe('FileDownload component.', () => {
  it('Matches snapshot.', () => {
    const renderedFileDownload = renderComponent()

    expect(renderedFileDownload.asFragment()).toMatchSnapshot()
  })

  it('Does not render download link if resource prop data is not provided.', () => {
    renderComponent({
      resource: {}
    })

    expect(screen.queryByText('Download full dataset')).not.toBeInTheDocument()
  })

  it('File download size displays.', async () => {
    // Mock api request inside FileDownload
    axiosMockAdapter.onHead(resourceData.data.downloadURL).reply(200, '', responseHeaders)

    window.location.protocol = 'https:',
    window.location.hostname = 'pqdc-dkan.ddev.site'

    await act(async () => {
      renderComponent()
    })

    expect(screen.queryByText('10 KB')).toBeInTheDocument()
  })

  it('Dataset explorer download link is formatted correctly.', async () => {
    renderComponent({
      ...componentArgs,
      isDatasetExplorerDownloadLink: true
    })

    expect(screen.queryByText('Download full dataset (CSV) 10 KB')).toBeInTheDocument()
  })

  it('Error is caught when api request fails.', async () => {
    // Mock failed api request inside FileDownload
    axiosMockAdapter.onHead(resourceData.data.downloadURL).reply(500, '', {}, {})
    const logDebug = vi.spyOn(log, 'debug')

    await act(async () => {
      renderComponent()
    })

    expect(logDebug).toHaveBeenCalledWith('Error retrieving fileSize, FileDownload: ', expect.objectContaining({}))
  })
})
