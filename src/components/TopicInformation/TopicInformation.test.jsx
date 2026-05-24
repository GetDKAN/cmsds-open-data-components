import React from 'react';
import TopicInformation from '.';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';

describe('TopicsInformation component.', () => {
  it('Renders correctly', async () => {
    renderWithProviders(
      <TopicInformation
        topicDetails={[
          {
            identifier: '5628a6e0-bae4-5da6-8546-8bb13705c1d5',
            url: 'hospitals',
            topic_icon:
              "<svg xmlns='http:\/\/www.w3.org\/2000\/svg' width='80' height='80' alt='Hospitals' viewBox='0 0 88 88'><g id='Illustrations\/hospital-solid' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><path fill='#1E3C70' d='M77.240439,7 C79.3169512,7 81,8.68485366 81,10.7631707 L81,77.2368293 C81,79.3151463 79.3169512,81 77.240439,81 L10.759561,81 C8.68304878,81 7,79.3151463 7,77.2368293 L7,10.7631707 C7,8.68485366 8.68304878,7 10.759561,7 L77.240439,7 Z M35.9511463,21.4390244 L24.1463415,21.4390244 L24.1463415,66.5609756 L35.9511463,66.5609756 L35.9511463,48.5121951 L52.0488537,48.5121951 L52.0488537,66.5609756 L63.8536585,66.5609756 L63.8536585,21.4390244 L52.0488537,21.4390244 L52.0488537,37.6829268 L35.9511463,37.6829268 L35.9511463,21.4390244 Z'><\/path><\/g><\/svg>",
          },
        ]}
        theme={[
          {
            identifier: '5628a6e0-bae4-5da6-8546-8bb13705c1d5',
            data: 'Hospitals',
          },
        ]}
      />,
    );

    expect(await screen.getByRole('link', { name: 'Topic Details' })).toHaveAttribute(
      'href',
      '/topics/hospitals',
    );
    expect(await screen.getByRole('link', { name: 'Archived Data' })).toHaveAttribute(
      'href',
      '/archived-data/hospitals',
    );
  });
});
