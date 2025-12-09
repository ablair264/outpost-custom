import React from 'react';
import { useParams } from 'react-router-dom';
import PrintingBrowser from '../components/printing/PrintingBrowser';

const PrintingBrowserPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();

  return <PrintingBrowser initialProductSlug={slug} />;
};

export default PrintingBrowserPage;
