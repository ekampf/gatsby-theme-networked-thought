/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import React, { PropsWithChildren } from "react";
import { Helmet } from "react-helmet";
import {
  LinkToStacked,
  PageIndexProvider,
  StackedPagesProvider,
  useStackedPagesProvider,
} from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { Box, Flex, jsx } from "theme-ui";
import Thought from "./thought";

const COL_WIDTH = 576; // w-xl

interface ThoughtsContainerProps {
  index: number;
  thought: any;
  location: any;
  slug: string;
}

const StackedPageWrapper = ({ index, ...rest }) => (
  <PageIndexProvider value={index}>
    <NoteWrapper {...rest} index={index} />
  </PageIndexProvider>
);

// A wrapper component to render the content of a page when stacked
const NoteWrapper = ({ children, slug, title, overlay, obstructed, highlighted, index }) => {
  return (
    <Flex
      bg={highlighted ? "accent" : "background"}
      px={3}
      sx={{
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
        position: [null, null, "sticky"], // here
        maxWidth: ["100%", "100%", "100vw"],
        boxShadow: overlay ? `0 0 8px rgba(0, 0, 0, 0.125)` : "",
        width: ["100%", "100%", COL_WIDTH],
        left: 40 * index,
        right: -585,
      }}
    >
      <Box
        sx={{
          display: ["none", "none", "block"],
          transition: "opacity",
          transitionDuration: 100,
          opacity: obstructed ? 1 : 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            zIndex: 10,
            transform: "rotate(90deg)",
            transformOrigin: "left",
          }}
          pb={2}
        >
          <LinkToStacked to={slug} sx={{ fontWeight: "bold", textDecoration: "none", color: "text" }}>
            {title || slug}
          </LinkToStacked>
        </Box>
      </Box>
      <Flex
        sx={{
          flexDirection: "column",
          minHeight: "100%",
          transition: "opacity",
          transitionDuration: 100,
          opacity: obstructed ? 0 : 1,
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default function ThoughtsContainer({
  thought,
  location,
  slug,
  children,
}: PropsWithChildren<ThoughtsContainerProps>) {
  const data = useStaticQuery(graphql`
    query ThoughtsContainerQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  const { width } = useWindowSize();
  const processPageQuery = React.useCallback((x) => x.thought, []);
  const [state, scrollContainer] = useStackedPagesProvider({
    firstPage: { slug, data: { thought: thought } },
    location,
    processPageQuery,
    pageWidth: COL_WIDTH,
  });
  const { stackedPages, stackedPageStates } = state;

  let pages = stackedPages;
  let indexToShow: int;
  if (width < 768) {
    const activeSlug = Object.keys(state.stackedPageStates).find((slug) => state.stackedPageStates[slug].active);
    indexToShow = state.stackedPages.findIndex((page) => page.slug === activeSlug);
    if (indexToShow === -1) {
      indexToShow = state.stackedPages.length - 1;
    }
    pages = [state.stackedPages[indexToShow]];
  }

  return (
    <Flex
      sx={{
        flexDirection: "column",
        height: "100vh",
        minHeight: "100vh",
      }}
    >
      <Helmet>
        <title>
          {data.site.siteMetadata.title} - {thought.title}
        </title>
      </Helmet>
      <Flex
        ref={scrollContainer}
        sx={{
          flex: 1,
          flexGrow: 1,
          overflowX: [null, null, "auto"],
          overflowY: "hidden",
        }}
      >
        <Flex
          className="thought-columns-container"
          sx={{
            minWidth: "unset",
            flexGrow: 1,
            transition: [null, null, "width"],
            transitionDuration: 100,
            width: ["100%", "100%", COL_WIDTH * (pages.length + 1)],
          }}
        >
          <StackedPagesProvider value={state}>
            {/* Render the stacked pages */}
            {pages.map((page, i) => (
              <StackedPageWrapper
                index={i}
                key={page.slug}
                slug={page.slug}
                title={page.data.title}
                overlay={stackedPageStates[page.slug] && stackedPageStates[page.slug].overlay}
                obstructed={
                  indexToShow !== undefined
                    ? false
                    : stackedPageStates[page.slug] && stackedPageStates[page.slug].obstructed
                }
                highlighted={stackedPageStates[page.slug] && stackedPageStates[page.slug].highlighted}
              >
                <Thought thought={page.data} />
              </StackedPageWrapper>
            ))}
          </StackedPagesProvider>
        </Flex>
      </Flex>
    </Flex>
  );
}
