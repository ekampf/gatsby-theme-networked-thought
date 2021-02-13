/** @jsx jsx */
import { Link } from "gatsby";
import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";
import { jsx } from "theme-ui";

const AnchorTag = ({ href, popups = {}, stacked = false, ...restProps }) => {
  if (!href) {
    href = restProps.to;
  }

  if (!href.match(/^http/)) {
    if (stacked) {
      return <LinkToStacked {...restProps} to={href} sx={{ variant: "links.internal" }} />;
    }
    return <Link {...restProps} to={href} sx={{ variant: "links.internal" }} />;
  }

  return <a {...restProps} href={href} />;
};

export default {
  a: AnchorTag,
};
