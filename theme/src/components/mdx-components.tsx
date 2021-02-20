/** @jsx jsx */
import { Link, graphql, useStaticQuery } from "gatsby";
import Img, { FluidObject, GatsbyImageOptionalProps } from "gatsby-image";
import _ from "lodash";
import { LinkToStacked } from "react-stacked-pages-hook";
import { useWindowSize } from "react-use";
import { Styled, jsx, useColorMode } from "theme-ui";
import Tippy, { TipContentWrapper } from "./tippy";

export type AnchorTagProps = {
  href: string;
  to?: string;
  previews?: { [key: string]: React.ReactNode };
};

function AnchorTag({ href, previews, ...restProps }: AnchorTagProps) {
  const [colorMode] = useColorMode();
  const { width } = useWindowSize();
  const stacked = width >= 768;
  if (!href) {
    href = restProps.to as string;
  }

  const previewsMapping = previews || {};

  if (!href.match(/^http/)) {
    if (stacked) {
      return (
        <Tippy content={previewsMapping[href.replace(/^\//, "")]}>
          <LinkToStacked {...restProps} to={href} sx={{ variant: "links.internal" }} />
        </Tippy>
      );
    }
    return <Link {...restProps} to={href} sx={{ variant: "links.internal" }} />;
  }

  const externalVariant = `links.external-${colorMode}`;
  const tipContent = <TipContentWrapper>{href}</TipContentWrapper>;

  return (
    <Tippy content={tipContent} placement="top">
      <Styled.a {...restProps} href={href} sx={{ variant: externalVariant }} />
    </Tippy>
  );
}

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
