/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/animations/shift-away-extreme.css";

export default function StyledTippy(props: any) {
  return <Tippy placement="right" animation="shift-away-extreme" theme="light-border" {...props} />;
}
