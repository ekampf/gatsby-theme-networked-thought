/** @jsx jsx */
import { Styled, jsx, Box } from "theme-ui";
import React from "react";
import { graphql, useStaticQuery } from "gatsby";

export default function ThoughtFooter() {
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
    <Box p={3} sx={{ borderRadius: 2 }} mb={2} bg="accent" color="text-light">
      <p sx={{ m: 0, fontSize: 1 }}>
        If you think this note resonated, be it positive or negative, send me a{" "}
        <Styled.a sx={{ textDecoration: "underline", color: "text-light" }} href={sendTweetLink}>
          tweet
        </Styled.a>{" "}
        or{" "}
        <Styled.a sx={{ textDecoration: "underline", color: "text-light" }} href={sendDMLink}>
          direct message
        </Styled.a>{" "}
        me on Twitter and we can talk.
      </p>
    </Box>
  );
}
