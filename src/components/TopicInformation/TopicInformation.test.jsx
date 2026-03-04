import React from 'react';
import TopicInformation from '.';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('TopicsInformation component.', () => {
  it('Renders correctly', async () => {
    render(
      <MemoryRouter>
        <TopicInformation
          topicDetails = {[{
            identifier: "5628a6e0-bae4-5da6-8546-8bb13705c1d5",
            url: 'hospitals',
            topic_icon: "\u003Csvg xmlns=\u0027http:\/\/www.w3.org\/2000\/svg\u0027 width=\u002780\u0027 height=\u002780\u0027 alt=\u0027Hospitals\u0027 viewBox=\u00270 0 88 88\u0027\u003E\u003Cg id=\u0027Illustrations\/hospital-solid\u0027 stroke=\u0027none\u0027 stroke-width=\u00271\u0027 fill=\u0027none\u0027 fill-rule=\u0027evenodd\u0027\u003E\u003Cpath fill=\u0027#1E3C70\u0027 d=\u0027M77.240439,7 C79.3169512,7 81,8.68485366 81,10.7631707 L81,77.2368293 C81,79.3151463 79.3169512,81 77.240439,81 L10.759561,81 C8.68304878,81 7,79.3151463 7,77.2368293 L7,10.7631707 C7,8.68485366 8.68304878,7 10.759561,7 L77.240439,7 Z M35.9511463,21.4390244 L24.1463415,21.4390244 L24.1463415,66.5609756 L35.9511463,66.5609756 L35.9511463,48.5121951 L52.0488537,48.5121951 L52.0488537,66.5609756 L63.8536585,66.5609756 L63.8536585,21.4390244 L52.0488537,21.4390244 L52.0488537,37.6829268 L35.9511463,37.6829268 L35.9511463,21.4390244 Z\u0027\u003E\u003C\/path\u003E\u003C\/g\u003E\u003C\/svg\u003E",          
          }]}
          theme = {[{
            identifier: "5628a6e0-bae4-5da6-8546-8bb13705c1d5",
            data: "Hospitals"
          }]}
        />
      </MemoryRouter>
    )

    expect(await screen.getByRole('link', {name: "Topic Details"})).toHaveAttribute('href', '/topics/hospitals');
    expect(await screen.getByRole('link', {name: "Archived Data"})).toHaveAttribute('href', '/archived-data/hospitals');
  });
});