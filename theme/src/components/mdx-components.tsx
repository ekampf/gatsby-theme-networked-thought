/** @jsx jsx */
import { Link } from "gatsby";
import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { Styled, jsx } from "theme-ui";

const AnchorTag = ({ href, popups = {}, ...restProps }) => {
  const { width } = useWindowSize();
  const stacked = width >= 768;
  if (!href) {
    href = restProps.to;
  }

  if (!href.match(/^http/)) {
    if (stacked) {
      return <LinkToStacked {...restProps} to={href} sx={{ variant: "links.internal" }} />;
    }
    return <Link {...restProps} to={href} sx={{ variant: "links.internal" }} />;
  }

  return <Styled.a {...restProps} href={href} />;
};

export default {
  a: AnchorTag,
};
