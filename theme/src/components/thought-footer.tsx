/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { jsx, Styled, Box } from "theme-ui";
import References from "./references";

type ThoughtFooterProps = {
  references: {
    slug: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thought: any;
  };
};

export default function ThoughtFooter({ references }: ThoughtFooterProps) {
  const data = useStaticQuery(graphql`
    query ThoughtFooterQuery {
      site {
        siteMetadata {
          twitter
        }
      }
    }
  `);

  const siteMetadata = data.site.siteMetadata || {};
  const sendTweetLink = `https://twitter.com/intent/tweet?screen_name=${siteMetadata.twitter}`;
  const sendDMLink = `https://twitter.com/messages/compose?recipient_id=${siteMetadata.twitter}`;

  return (
    <Box as="footer" p={3} sx={{ borderRadius: 2, backgroundColor: "backgroundSecondary" }} mb={2} color="muted">
      <References references={references} />
      <p sx={{ m: 0, fontSize: 1 }}>
        If you think this note resonated, be it positive or negative, send me a{" "}
        <Styled.a sx={{ textDecoration: "underline", color: "muted" }} href={sendTweetLink}>
          tweet
        </Styled.a>{" "}
        or{" "}
        <Styled.a sx={{ textDecoration: "underline", color: "muted" }} href={sendDMLink}>
          direct message
        </Styled.a>{" "}
        me on Twitter and we can talk.
      </p>
    </Box>
  );
}
