import { graphql, PageProps } from "gatsby";
import React from "react";
import ThoughtsContainer from "../components/thoughts-container";

export const pageQuery = graphql`
  query Thought($id: String!) {
    thought(id: { eq: $id }) {
      title
      slug
      aliases
      content
      id
      mtime
      mtimeFmt: mtime(formatString: "DD, MMMM YYYY")
      childMdx {
        body
      }
      outboundReferences {
        slug
        thought {
          id
          title
          slug
          childMdx {
            body
            excerpt
          }
        }
        previewMarkdown
        previewHtml
      }
      inboundReferences {
        slug
        thought {
          id
          title
          slug
          childMdx {
            body
            excerpt
          }
        }
        previewMarkdown
        previewHtml
      }
    }
  }
`;

interface ThoughtTemplateProps extends PageProps {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thought: any;
  };
  pageContext: {
    slug: string;
  };
}

export default function ThoughtTemplate(props: ThoughtTemplateProps) {
  const {
    location,
    data: { thought },
    pageContext: { slug },
  } = props;
  return <ThoughtsContainer thought={thought} location={location} slug={slug} />;
}
