import { graphql, PageProps } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import React from "react";
import Layout from "../components/layout";
import ThoughtsContainer from "../components/thoughts-container";

export const pageQuery = graphql`
  query Thought($id: String!) {
    thought(id: { eq: $id }) {
      title
      slug
      aliases
      content
      id
      childMdx {
        body
      }
    }
  }
`;

interface ThoughtTemplateProps extends PageProps {
  data: {
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
  return (
    <ThoughtsContainer thought={thought} location={location} slug={slug}>
      <h1>{thought.title}</h1>
      <MDXRenderer>{thought.childMdx.body}</MDXRenderer>
    </ThoughtsContainer>
  );
}
