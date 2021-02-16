import { useStaticQuery, graphql } from "gatsby";
import React, { PropsWithChildren } from "react";
import Helmet from "react-helmet";

type SEOProps = {
  description?: string;
  lang?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  keywords?: string[];
  title: string;
};

export default function SEO({ description, lang, keywords, title, children }: PropsWithChildren<SEOProps>) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            twitter
          }
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: `@${site.siteMetadata.twitter}`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(
        keywords.length > 0
          ? {
              name: `keywords`,
              content: keywords.join(`, `),
            }
          : [],
      )}
    >
      {children}
    </Helmet>
  );
}

SEO.defaultProps = {
  title: "",
  keywords: [],
  lang: "us-en",
  meta: [],
};
