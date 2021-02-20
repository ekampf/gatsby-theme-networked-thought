/** @jsx jsx */
import { Link } from "gatsby";
import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { jsx, Styled, Box, Heading } from "theme-ui";

type ReferencesProps = {
  references: {
    slug: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thought: any;
  };
};

export default function References({ references }: ReferencesProps) {
  const { width } = useWindowSize();
  const RefLink = width < 768 ? Link : LinkToStacked;

  return (
    <div>
      <Heading as="h4" color="text-light">
        Referred in
      </Heading>
      <div sx={{ mb: 2 }}>
        {references.map((ref) => (
          <RefLink
            key={ref.slug}
            sx={{
              textDecoration: "none",
              color: "text-light",
              ":hover": {
                color: "text",
              },
            }}
            to={`/${ref.slug}`}
          >
            <div sx={{ py: 2 }}>
              <Styled.p sx={{ fontSize: 2, m: 0, color: "text-light" }}>{ref.thought.title}</Styled.p>
              <cite sx={{ fontSize: 1, m: 0, color: "text-light" }}>{ref.thought.childMdx.excerpt}</cite>
            </div>
          </RefLink>
        ))}
      </div>
    </div>
  );
}
