import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatasetDownloadLink from './DatasetDownloadLink'
import { MemoryRouter } from 'react-router-dom'

// Mock window.scrollTo
global.scrollTo = vi.fn()

// Mock window.location
global.window = Object.create(window)
Object.defineProperty(window, 'location', {
  value: {
     href: ''
  },
  writable: true
})

const componentArgs = {
  linkText: 'Download CSV',
  linkAriaLabel: undefined,
  linkHref: 'https://www.google.com',
  className: undefined,
  downloadAttr: false,
  onClick: vi.fn()
}

const renderComponent = (args = componentArgs) => render(
  <MemoryRouter
    initialEntries={[{
      pathname: '/topics',
      search: '',
      hash: '',
      state: {
        fromTitle: '',
        fromUrl: ''
      },
      key: 'abc123'
    }]}
  >
    <DatasetDownloadLink {...args} />
  </MemoryRouter>
)

describe('DatasetDownloadLink component.', () => {
  it('Matches snapshot.', () => {
    const renderedDatasetDownloadLink = renderComponent({
      ...componentArgs,
      linkText: 'Download CSV',
      linkAriaLabel: 'Download CSV',
      linkHref: 'https://www.google.com'
    })

    expect(renderedDatasetDownloadLink.asFragment()).toMatchSnapshot()
  })

  it('Dialog does not show initially', () => {
    const { container } = renderComponent()

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe(null)
  })

  it('Download link has class name when passed via \'className\' prop', () => {
    renderComponent({
      ...componentArgs,
      linkText: 'Download CSV',
      linkHref: 'https://www.google.com',
      className: 'test-class'
    })

    expect(screen.getByRole('button', { name: 'Download CSV' })).toHaveClass('test-class')
  })

  it('Download link has download attribute when passed via \'download\' prop', () => {
    renderComponent({
      ...componentArgs,
      linkText: 'Download CSV',
      linkHref: 'https://www.google.com',
      downloadAttr: true
    })

    expect(screen.getByRole('button', { name: 'Download CSV' }).getAttribute('download')).toEqual('')
  })

  it('Clicking the \'Download CSV\' link reveals the dialog', async () => {
    const { container } = renderComponent()

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Download CSV' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe('')
  })

  it('Cancelling the dialog closes the dialog', async () => {
    const { container } = renderComponent()

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Download CSV' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe('')

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'No, cancel' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe(null)
  })

  it('Clicking the close button (X) closes the dialog', async () => {
    const { container } = renderComponent()

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Download CSV' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe('')

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Close notice dialog' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe(null)
  })

  it('Clicking the \'Ok, download\' button downloads the CSV', async () => {
    const { container } = renderComponent()

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Download CSV' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe('')

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Yes, download' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe(null)
    expect(window.location.href).toEqual('https://www.google.com')
  })

  it('Fires default \'onClick\' prop function when onClick prop is passed', async () => {
    const { container } = renderComponent({
      ...componentArgs,
      linkHref: undefined, // No purpose for doing this - just for full test coverage
      onClick: undefined // No purpose for doing this - just for full test coverage
    })

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Download CSV' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe('')

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Yes, download' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe(null)
  })

  it('Fires custom \'onClick\' prop function when onClick prop is passed', async () => {
    const onClick = vi.fn()
    
    const { container } = renderComponent({
      ...componentArgs,
      linkHref: undefined,
      onClick: onClick
    })

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Download CSV' })))

    expect(container.querySelector('.csv-download-link-dialog').getAttribute('open')).toBe('')

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Yes, download' })))

    expect(onClick).toHaveBeenCalled()
  })
})
