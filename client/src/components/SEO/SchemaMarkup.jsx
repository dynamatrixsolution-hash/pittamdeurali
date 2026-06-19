import React from 'react';
import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ 
  type = 'WebSite', 
  title, 
  description, 
  url, 
  image, 
  faqs = [], 
  breadcrumbs = [], 
  reviews = [], 
  priceRange = "$",
  rooms = []
}) => {
  const baseUrl = "https://pittamdeuraliguesthouse.com";
  const siteUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  // Organization Schema (Base)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pitam Deurali Guest House",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-9846012345", // Replace with real number
      "contactType": "customer service",
      "areaServed": "NP",
      "availableLanguage": ["English", "Nepali"]
    },
    "sameAs": [
      "https://www.facebook.com/pitamdeuraliguesthouse",
      "https://www.instagram.com/pitamdeuraliguesthouse"
    ]
  };

  // Local Business & Hotel Schema
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": ["Hotel", "LocalBusiness"],
    "name": "Pitam Deurali Guest House",
    "image": image ? `${baseUrl}${image}` : `${baseUrl}/assets/hotel-exterior.webp`,
    "description": "Cozy family-run lodging and organic dining in Pothana, Dhampus. Stunning Himalayan views along the Mardi Himal Trek.",
    "url": baseUrl,
    "telephone": "+977-9846012345",
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pitam Deurali, Pothana",
      "addressLocality": "Dhampus",
      "addressRegion": "Gandaki Province",
      "postalCode": "33700",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.3183, // Actual coords for Pitam Deurali
      "longitude": 83.8291
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "3"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Hot Shower",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Wi-Fi",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Restaurant",
        "value": "True"
      }
    ]
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pitam Deurali Guest House",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // FAQ Schema
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.path}`
    }))
  } : null;

  // Review Schema
  const reviewSchema = reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Pitam Deurali Guest House",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": reviews.length.toString()
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating
      }
    }))
  } : null;

  // Image Schema
  const imageSchema = image ? {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": `${baseUrl}${image}`,
    "license": baseUrl,
    "acquireLicensePage": baseUrl,
    "creditText": "Pitam Deurali Guest House",
    "creator": {
      "@type": "Organization",
      "name": "Pitam Deurali Guest House"
    },
    "copyrightNotice": "Pitam Deurali Guest House"
  } : null;

  // Compile the schema array based on props
  const schemasToRender = [];
  
  if (type === 'Organization' || type === 'Home') schemasToRender.push(organizationSchema);
  if (type === 'Hotel' || type === 'Home') schemasToRender.push(hotelSchema);
  if (type === 'WebSite' || type === 'Home') schemasToRender.push(websiteSchema);
  if (faqSchema) schemasToRender.push(faqSchema);
  if (breadcrumbSchema) schemasToRender.push(breadcrumbSchema);
  if (reviewSchema) schemasToRender.push(reviewSchema);
  if (imageSchema) schemasToRender.push(imageSchema);

  return (
    <Helmet>
      {schemasToRender.map((schema, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SchemaMarkup;
