/** @jsx jsx */
import { Link } from "gatsby";
import React from "react";
import { LinkToStacked } from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { Styled, jsx } from "theme-ui";
import { graphql, useStaticQuery } from "gatsby";
import Img, { FluidObject, GatsbyImageOptionalProps } from "gatsby-image";
import Tippy from "./tippy";

const AnchorTag = ({ href, popups = {}, ...restProps }) => {
  const { width } = useWindowSize();
  const stacked = width >= 768;
  if (!href) {
    href = restProps.to;
  }

  if (!href.match(/^http/)) {
    if (stacked) {
      return (
        <Tippy content="This is just a sample about page to use as a root. You can point a markdown editor tool, ">
          <LinkToStacked {...restProps} to={href} sx={{ variant: "links.internal" }} />
        </Tippy>
      );
    }
    return <Link {...restProps} to={href} sx={{ variant: "links.internal" }} />;
  }

  return <Styled.a {...restProps} href={href} />;
};

type ImageProps = { src: string } & GatsbyImageOptionalProps;

function Image(props: ImageProps) {
  console.log("Image: ", props);
  const { src, ...rest } = props;
  const data = useStaticQuery(graphql`
    query ImageComponent {
      images: allFile {
        nodes {
          relativePath
          name
          childImageSharp {
            fluid(maxWidth: 1800) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    }
  `);

  if (src.match(/^http/)) {
    return <img src={src} {...rest} />;
  }

  const image = data.images.nodes.find((n) => {
    return n.relativePath.includes(src);
  });
  if (!image) {
    return null;
  }

  const fluid = image.childImageSharp?.fluid as FluidObject;
  return <Img loading="lazy" fadeIn={true} fluid={fluid} {...rest} />;
}

export default {
  a: AnchorTag,
  img: Image,
};
