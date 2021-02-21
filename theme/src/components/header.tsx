/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import DarkModeToggle from "react-dark-mode-toggle";
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
        <DarkModeToggle
          size={40}
          onChange={() => {
            setTimeout(() => {
              setColorMode(colorMode === "default" ? "dark" : "default");
            }, 800);
          }}
          checked={colorMode != "default"}
          className="darkModeToggle"
        />
      </Box>
    </header>
  );
}
