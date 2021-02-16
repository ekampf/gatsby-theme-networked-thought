import externalLinkImageLight from './external-link-light.svg';
import externalLinkImageDark from './external-link-dark.svg';

export default {
  useCustomProperties: true,
  useColorSchemeMediaQuery: true,
  colors: {
    text: "#333",
    muted: "#718096",
    background: "#fff",
    backgroundSecondary: "#fafafc",
    primary: "#3182ce",
    links: "#3182ce",
    linksHover: "#3182ce",
    gray: "#dadada",
    accent: "#fafafc",
    accentHover: "#fafafc",
    highlightBg: "rgba(255, 255, 0, 0.4)",
    highlightBgActive: "rgba(255, 128, 0, 0.4)",

    modes: {
      dark: {
        text: "#dcddde",
        muted: "#999",
        faint: "#666",
        background: "#202020",
        backgroundSecondary: "#161616",
        primary: "#7f6df2",
        links: "#483699",
        linksHover: "#4d3ca6",
        gray: "#dadada",
        accent: "#7f6df2",
        accentHover: "#8875ff",
      },
    },
  },
  breakpoints: ["640px", "768px", "1024px", "1280px"],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  borders: [0, 1, 2, 3, 4],
  radii: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  links: {
    internal: {
      color: "links",
      px: "2px",
      mx: "-2px",
      borderRadius: 1,
      cursor: "pointer",
      textDecoration: "none",
      ":hover": {
        color: "linksHover",
        bg: "accent",
      },
      ":focus": {
        bg: "accent",
      },
    },
    "external-default": {
      cursor: "pointer",
      backgroundPosition: "center right",
      backgroundRepeat: "no-repeat",
      backgroundImage: `linear-gradient(transparent, transparent), url(${externalLinkImageLight});`,
      backgroundSize: "13px",
      paddingRight: "16px",
      backgroundPositionY: "4px",
      fontStyle: "italic"
    },
    "external-dark": {
      cursor: "pointer",
      backgroundPosition: "center right",
      backgroundRepeat: "no-repeat",
      backgroundImage: `linear-gradient(transparent, transparent), url(${externalLinkImageDark});`,
      backgroundSize: "13px",
      paddingRight: "16px",
      backgroundPositionY: "4px",
      fontStyle: "italic"
    }
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    h1: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 5,
    },
    h2: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 4,
    },
    h3: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 3,
    },
    h4: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 2,
    },
    h5: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 1,
    },
    h6: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 0,
    },
    p: {
      color: "text",
    },
    a: {
      color: "links",
      textDecoration: "none",
      ":hover": {
        color: "linksHover",
        textDecoration: "underline",
      },
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
    span: { color: "text" },
  },
};
