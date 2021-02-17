/** @jsx jsx */
import { Link, graphql, useStaticQuery } from "gatsby";
import Img, { FluidObject, GatsbyImageOptionalProps } from "gatsby-image";
import _ from "lodash";
import { LinkToStacked } from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { Styled, jsx, useColorMode } from "theme-ui";
import Tippy from "./tippy";

type AnchorTagProps = { href: string; to?: string };

const AnchorTag = ({ href, ...restProps }: AnchorTagProps) => {
  const [colorMode] = useColorMode();
  const { width } = useWindowSize();
  const stacked = width >= 768;
  if (!href) {
    href = restProps.to as string;
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

  const externalVariant = `links.external-${colorMode}`;
  return <Styled.a {...restProps} href={href} sx={{ variant: externalVariant }} />;
};

type ImageProps = { src: string } & GatsbyImageOptionalProps;

function Image(props: ImageProps) {
  const { src, ...rest } = props;
  const data = useStaticQuery(graphql`
    query ImageComponent {
      images: allFile {
        nodes {
          relativePath
          name
          childImageSharp {
            fluid(maxWidth: 1800) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  `);

  if (src.match(/^http/)) {
    const imageProps = _.pick(rest, ["title", "alt", "className", "style"]);
    return <img src={src} {..._.pickBy(imageProps, _.identity)} />;
  }

  const image = data.images.nodes.find(({ relativePath }: { relativePath: string }) => {
    return relativePath.includes(src);
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
