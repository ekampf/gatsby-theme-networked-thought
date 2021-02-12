import { PageProps } from "gatsby";
import React from "react";

export default function Home(props: PageProps) {
  return (
    <div>
      <h1>Error 404: {props.path}</h1>
    </div>
  );
}
