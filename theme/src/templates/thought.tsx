import { graphql, PageProps } from "gatsby";
import React from "react";
import { Layout } from "../components/layout";

export const pageQuery = graphql`
  query Thought($id: String!) {
    thought(id: { eq: $id }) {
      title
      slug
      aliases
      content
      id
    }
  }
`;

interface ThoughtData {
  thought: any;
}

interface ThoughtTemplateProps extends PageProps {
  data: ThoughtData;
}

export default function ThoughtTemplate(props: PageProps) {
  console.log(props);
  const {
    uri,
    data: { thought },
  } = props;
  return (
    <Layout>
      <h1>{thought.title}</h1>
    </Layout>
  );
}
