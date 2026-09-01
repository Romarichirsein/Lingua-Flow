import React from "react";
import { Helmet } from "react-helmet-async";

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const Metadata: React.FC<MetadataProps> = ({
  title = "LinguaFlow • Plateforme SaaS E-Learning Multi-Écoles",
  description = "Solution SaaS multi-tenant pour écoles de langues Allemand & Italien. Gestion de cohortes, vidéos protégées, IA pédagogique et conformité CECRL.",
  keywords = "LinguaFlow, e-learning, allemand, italien, CECRL, SaaS multi-tenant, écoles de langues",
  ogImage = "/logo.png",
}) => {
  const fullTitle = title.includes("LinguaFlow") ? title : `${title} | LinguaFlow`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
