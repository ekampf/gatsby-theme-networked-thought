/** @jsx jsx */
import React from "react";
import { Link } from "gatsby";
import { jsx } from "theme-ui";
import { LinkToStacked } from "react-stacked-pages-hook";

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
