/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";
import { jsx, Box, useColorMode } from "theme-ui";

export default function Header() {
  const [colorMode, setColorMode] = useColorMode();
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header>
      <Box py={2} px={3} sx={{ borderBottom: "1px solid", borderColor: "gray" }}>
        <Link to="/" sx={{ fontWeight: "bold", color: "text", textDecoration: "none" }}>
          {data.site.siteMetadata.title}
        </Link>
        {"  "}
        <button
          onClick={() => {
            setColorMode(colorMode === "default" ? "dark" : "default");
          }}
        >
          Toggle {colorMode === "default" ? "Dark" : "Light"}
        </button>
      </Box>
    </header>
  );
}
