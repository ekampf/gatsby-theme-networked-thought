/** @jsx jsx */
/* @jsxFrag React.Fragment */
import { Global, css } from "@emotion/core";
import React, { PropsWithChildren } from "react";
import { Helmet } from "react-helmet";
import { jsx, Flex } from "theme-ui";
import Header from "./header";

type LayoutProps = {};

export default function Layout({ children }: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
      </Helmet>
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
      {children}
    </>
  );
}
