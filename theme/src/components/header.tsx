/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql, Link, StaticQuery } from "gatsby";
import React from "react";
import { Box } from "theme-ui";

export default function Header() {
  return (
    <StaticQuery
      query={graphql`
        query HeaderQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => (
        <header>
          <Box py={2} px={3} sx={{ borderBottom: "1px solid", borderColor: "gray" }}>
            <Link to="/" sx={{ fontWeight: "bold", color: "text", textDecoration: "none" }}>
              {data.site.siteMetadata.title}
            </Link>
          </Box>
        </header>
      )}
    />
  );
}
