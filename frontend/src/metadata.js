import Helmet from 'react-helmet';

import React from 'react';

export default function Metadata({ title }) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}
