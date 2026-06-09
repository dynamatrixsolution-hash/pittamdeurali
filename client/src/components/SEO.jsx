import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  slug = '',
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription
}) => {
  const siteUrl = 'https://pittamdeuraliguesthouse.com';
  const canonicalUrl = `${siteUrl}${slug}`;
  const displayTitle = title ? `${title}` : 'Pitam Deurali Guest House | Pothana';
  
  // Convert keywords to comma-separated string if array
  const keywordsString = Array.isArray(keywords) 
    ? keywords.join(', ') 
    : keywords;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{displayTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle || displayTitle} />
      {description && <meta property="og:description" content={ogDescription || description} />}
      <meta property="og:image" content={`${siteUrl}/logo.png`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || displayTitle} />
      {description && <meta name="twitter:description" content={twitterDescription || ogDescription || description} />}
      <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
    </Helmet>
  );
};

export default SEO;
