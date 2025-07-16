import renderer from 'react-test-renderer'
import DatasetDate from './DatasetDate'

describe('DatasetDate component.', () => {
  it('Matches snapshot.', () => {
    const renderedDatasetDate = renderer.create(
      <DatasetDate date={{
        modified: '2023-02-01',
        released: '2023-01-01'
      }} />
    ).toJSON()

    expect(renderedDatasetDate).toMatchSnapshot()
  })
})
