/** @jsx jsx */
import { Global, css } from "@emotion/core";
import React from "react";
import {
  LinkToStacked,
  ScrollState,
  PageIndexProvider,
  StackedPagesProvider,
  useStackedPagesProvider,
} from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { jsx, Box, Flex } from "theme-ui";
import Header from "./header";
import SEO from "./seo";
import Thought from "./thought";

const COL_WIDTH = 576; // w-xl

interface StackedPageWrapperProps {
  slug: string;
  title: string;
  overlay: boolean;
  obstructed: boolean;
  highlighted: boolean;
  index: number;
}

const StackedPageWrapper = ({ index, ...rest }: React.PropsWithChildren<StackedPageWrapperProps>) => (
  <PageIndexProvider value={index}>
    <NoteWrapper {...rest} index={index} />
  </PageIndexProvider>
);

// A wrapper component to render the content of a page when stacked
type NoteWrapperProps = React.PropsWithChildren<StackedPageWrapperProps>;

const NoteWrapper = ({ children, slug, title, overlay, obstructed, highlighted, index }: NoteWrapperProps) => {
  return (
    <Flex
      as="article"
      px={3}
      sx={{
        bg: highlighted ? "backgroundSecondary" : "background",
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
          transitionDuration: "100",
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
          transitionDuration: "100",
          opacity: obstructed ? 0 : 1,
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};

interface ThoughtsContainerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thought: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any;
  slug: string;
}

type StackedPagesState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackedPages: { slug: string; data: any }[];
  navigateToStackedPage: (to: string, index?: number | undefined) => void;
  highlightStackedPage: (slug: string, highlighted?: boolean | undefined) => void;
  stackedPageStates: ScrollState;
};

type ScrollContainerRef = (node: HTMLDivElement) => void;

export default function ThoughtsContainer({ thought, location, slug }: ThoughtsContainerProps) {
  const { width } = useWindowSize();
  const processPageQuery = React.useCallback((x) => x.thought, []);
  let [state, scrollContainer] = useStackedPagesProvider({
    firstPage: { slug, data: { thought: thought } },
    location,
    processPageQuery,
    pageWidth: COL_WIDTH,
  });

  state = state as StackedPagesState;
  scrollContainer = scrollContainer as ScrollContainerRef;

  const { stackedPages, stackedPageStates } = state;

  let pages = stackedPages;
  let indexToShow: number;
  if (width < 768) {
    const activeSlug = Object.keys(stackedPageStates).find((slug) => stackedPageStates[slug].active);
    indexToShow = stackedPages.findIndex((page) => page.slug === activeSlug);
    if (indexToShow === -1) {
      indexToShow = stackedPages.length - 1;
    }
    pages = [stackedPages[indexToShow]];
  }

  return (
    <Flex
      as="main"
      sx={{
        flexDirection: "column",
        height: "100vh",
        minHeight: "100vh",
      }}
    >
      <Global
        styles={css`
          *,
          *::after,
          *::before {
            box-sizing: border-box;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }

          .darkModeToggle {
            float: right;
            outline: 0;
          }

          .gatsby-code-title {
            margin-bottom: -0.6rem;
            padding: 0.25rem 1rem;
            background-color: #dddddd;
            color: #5c6e74;
            font-size: 14px;
            font-weight: 400;
            border-top-left-radius: 0.3em;
            border-top-right-radius: 0.3em;
            z-index: 0;
          }
        `}
      />
      <SEO title={thought.title} />

      <Header />

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
            transitionDuration: "100",
            width: ["100%", "100%", COL_WIDTH * (pages.length + 1)],
          }}
        >
          <StackedPagesProvider value={state}>
            {/* Render the stacked pages */}
            {pages &&
              pages.map((page, i) => (
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
