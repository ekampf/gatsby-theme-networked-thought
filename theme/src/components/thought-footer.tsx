/** @jsx jsx */
import { Styled, jsx, Box } from "theme-ui";
import React from "react";

export default function ThoughtFooter() {
  return (
    <Box s="footer" p={3} sx={{ borderRadius: 2 }} mb={2} bg="accent" color="text-light">
      <p sx={{ m: 0, fontSize: 1 }}>
        If you think this note resonated, be it positive or negative, send me a{" "}
        <Styled.a
          sx={{ textDecoration: "underline", color: "text-light" }}
          href="https://twitter.com/messages/compose?recipient_id="
        >
          direct message
        </Styled.a>{" "}
        on Twitter or an{" "}
        <Styled.a sx={{ textDecoration: "underline", color: "text-light" }} href="#">
          email
        </Styled.a>{" "}
        and we can talk.
      </p>
    </Box>
  );
}
