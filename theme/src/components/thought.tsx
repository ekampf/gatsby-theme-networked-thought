/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { jsx, Box, Styled } from "theme-ui";
import mdxComponents, { AnchorTagProps } from "./mdx-components";
import ThoughtFooter from "./thought-footer";
import { TipContentWrapper } from "./tippy";

type Reference = {
  slug: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thought: any;
};

function ReferencePreviewTip({ reference }: { reference: Reference }) {
  const { thought } = reference;

  return (
    <TipContentWrapper>
      <Styled.h3
        sx={{
          my: 3,
        }}
      >
        {thought.title}
      </Styled.h3>
      <Styled.p>{thought.childMdx.excerpt}</Styled.p>
    </TipContentWrapper>
  );
}

interface ThoughtProps {
  thought: {
    title: string;
    mtime: string;
    mtimeFmt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    childMdx: any;
    inboundReferences: Reference[];
    outboundReferences: Reference[];
  };
}

export default function Thought({ thought }: ThoughtProps) {
  const previews: Record<string, React.ReactNode> = {};
  const outboundReferences = thought.outboundReferences || [];
  outboundReferences
    .filter((reference) => !!reference.thought.childMdx.excerpt)
    .forEach((reference) => {
      previews[reference.slug] = <ReferencePreviewTip reference={reference} />;
    });

  const AnchorTagWithPopups = (props: AnchorTagProps) => {
    return <mdxComponents.a previews={previews} {...props} />;
  };
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
      <ThoughtFooter references={thought.inboundReferences} />
    </MDXProvider>
  );
}
