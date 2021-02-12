/** @jsx jsx */
import { MDXRenderer } from "gatsby-plugin-mdx";
import { useWindowSize } from "react-use";
import { Box, jsx, Styled, ThemeProvider } from "theme-ui";
import theme from "../gatsby-plugin-theme-ui";
import mdxComponents from "./mdx-components";

interface ThoughtProps {
  thought: any;
}

export default function Thought({ thought }: ThoughtProps) {
  const { width } = useWindowSize();
  const AnchorTagWithPopups = (props: any) => <mdxComponents.a {...props} stacked={width >= 768} />;
  const components = { ...mdxComponents, a: AnchorTagWithPopups };

  return (
    <ThemeProvider theme={theme} components={components}>
      <Box sx={{ flex: "1" }}>
        <Styled.h1 sx={{ my: 3 }}>{thought.title}</Styled.h1>
        <MDXRenderer>{thought.childMdx.body}</MDXRenderer>
      </Box>
      {/* <Footer references={note.inboundReferenceNotes} /> */}
      **TODO: put references here**
    </ThemeProvider>
  );
}
