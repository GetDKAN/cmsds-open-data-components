import renderer from 'react-test-renderer'
import DatasetHeaderLoading from './DatasetHeaderLoading'

describe('DatasetHeaderLoading component.', () => {
  it('Matches snapshot.', async () => {
    const renderedDatasetHeaderLoading = renderer.create(
      <DatasetHeaderLoading />
    ).toJSON()

    expect(renderedDatasetHeaderLoading).toMatchSnapshot()
  })
})
