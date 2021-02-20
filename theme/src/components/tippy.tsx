/** @jsx jsx */
import Tippy, { TippyProps } from "@tippyjs/react";
import { PropsWithChildren } from "react";
import { Box, jsx } from "theme-ui";
import "tippy.js/animations/shift-away-extreme.css";

export function TipContentWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <Box bg="background" p={3} sx={{ borderRadius: 2, boxShadow: "0 0 8px rgba(0, 0, 0, 0.125)" }}>
      {children}
    </Box>
  );
}

export default function StyledTippy(props: TippyProps) {
  return <Tippy placement="right" animation="shift-away-extreme" theme="light-border" {...props} />;
}
