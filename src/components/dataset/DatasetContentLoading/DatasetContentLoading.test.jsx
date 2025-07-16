import renderer from 'react-test-renderer'
import DatasetLoading, { DatasetContentLoading, DatasetHeaderLoading } from './DatasetContentLoading'

describe('DatasetContentLoading component.', () => {
  it('DatasetContentLoading matches snapshot.', () => {
    const renderedDatasetContentLoading = renderer.create(
      <DatasetContentLoading />
    ).toJSON()

    expect(renderedDatasetContentLoading).toMatchSnapshot()
  })

  it('DatasetLoading matches snapshot.', () => {
    const renderedDatasetLoading = renderer.create(
      <DatasetLoading />
    ).toJSON()

    expect(renderedDatasetLoading).toMatchSnapshot()
  })

  it('DatasetHeaderLoading matches snapshot.', () => {
    const renderedDatasetHeaderLoading = renderer.create(
      <DatasetHeaderLoading />
    ).toJSON()

    expect(renderedDatasetHeaderLoading).toMatchSnapshot()
  })
})
