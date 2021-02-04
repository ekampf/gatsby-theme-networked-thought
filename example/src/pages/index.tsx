import React from "react";
import { PageProps } from "gatsby";
import { Box } from "theme-ui";

export default function Home(props: PageProps) {
  return (
    <div>
      <h1>Path: {props.path}</h1>
      <p>Hello World!</p>
      <Box bg="primary">theme works!</Box>
    </div>
  );
}
