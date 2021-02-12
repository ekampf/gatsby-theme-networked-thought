/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { PropsWithChildren } from "react";
import { Helmet } from "react-helmet";
import { Flex } from "theme-ui";
import Footer from "./footer";
import Header from "./header";

type LayoutProps = {};

export default function Layout({ children }: PropsWithChildren<LayoutProps>) {
  return (
    <Flex
      sx={{
        flexDirection: "column",
        height: "100vh",
        minHeight: "100vh",
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
      </Helmet>
      <Header />
      <main>{children}</main>
      <Footer />
    </Flex>
  );
}
