import React from "react";
import { PageProps } from "gatsby";

export default function Home(props: PageProps) {
  return (
    <div>
      <h1>Path: {props.path}</h1>
      <p>Hello World!</p>
    </div>
  );
}
