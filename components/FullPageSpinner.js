import React from 'react';
import { Layout, Spinner } from '@ui-kitten/components';

const FullPageSpinner = () => (
  <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Spinner size="giant" />
  </Layout>
);

export default FullPageSpinner;
