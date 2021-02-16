/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import React from "react";
import { jsx, Box, Styled, ThemeProvider } from "theme-ui";
import mdxComponents from "./mdx-components";
import ThoughtFooter from "./thought-footer";

interface ThoughtProps {
  thought: any;
}

export default function Thought({ thought }: ThoughtProps) {
  const AnchorTagWithPopups = (props: any) => <mdxComponents.a {...props} />;
  // TODO: add tooltip preview info
  const components = { ...mdxComponents, a: AnchorTagWithPopups };

  return (
    <MDXProvider components={{ ...components, a: AnchorTagWithPopups }}>
      <Box sx={{ flex: "1" }}>
        <Styled.h1 sx={{ my: 3 }}>{thought.title}</Styled.h1>
        <span sx={{ fontSize: 0, color: "muted" }}>
          Last updated on <time dateTime={thought.mtime}>{thought.mtimeFmt}</time>
        </span>

        <MDXRenderer>{thought.childMdx.body}</MDXRenderer>
      </Box>
      {/* <Footer references={note.inboundReferenceNotes} /> */}
      <ThoughtFooter />
    </MDXProvider>
  );
}
