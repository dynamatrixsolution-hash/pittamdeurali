import React from 'react';
import { Helmet } from 'react-helmet-async';
import SchemaMarkup from './SchemaMarkup';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  url, 
  image = "/assets/social-share.webp", 
  type = "WebSite",
  faqs = [],
  breadcrumbs = [],
  reviews = []
}) => {
  const siteName = "Pitam Deurali Guest House";
  const baseUrl = "https://pittamdeuraliguesthouse.com";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = `${baseUrl}${image}`;

  return (
    <>
      <Helmet>
        {/* Basic Metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type === 'Article' ? 'article' : 'website'} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImage} />
        <meta property="og:site_name" content={siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={fullUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImage} />
      </Helmet>

      {/* Structured Data (Schema.org) */}
      <SchemaMarkup 
        type={type === 'Article' ? 'Article' : (url === '/' ? 'Home' : type)} 
        url={url}
        image={image}
        faqs={faqs}
        breadcrumbs={breadcrumbs}
        reviews={reviews}
      />
    </>
  );
};

export default SEO;
