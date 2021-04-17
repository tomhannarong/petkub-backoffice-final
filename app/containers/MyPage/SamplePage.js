import React from 'react';
import { Helmet } from 'react-helmet';
import { PapperBlock, SampleComponent, VideoCard } from 'dan-components';

class SamplePage extends React.Component {
  render() {
    const title = 'Dandelion Pro. Blank Page';
    const description = 'Dandelion Pro';
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Blank Page" desc="Some text description">
          <SampleComponent />
          <VideoCard />
        </PapperBlock>
        
      </div>
    );
  }
}

export default SamplePage;