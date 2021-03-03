import { unstable_renderSubtreeIntoContainer } from "react-dom";
import html from "rehype-stringify";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import stringifyMd from "remark-stringify";
import unified from "unified";
import type { Node, Parent } from "unist";


function findDeepestChildForPosition(parent: any, tree: any, position: number): any {
  if (!tree.children || tree.children.length == 0) {
    return {
      parent: parent,
      child: tree,
    };
  }

  for (const child of tree.children) {
    const childPosition = child.position;
    if (childPosition) {
      const { start, end } = childPosition
      if (start.offset && start.offset <= position && end.offset && end.offset >= position) {
        return findDeepestChildForPosition(
          {
            parent: parent,
            node: tree,
          },
          child,
          position,
        );
      }
    }
  }
  return {
    parent: parent,
    child: tree,
  };
}

function textNoEscaping(this: unified.Processor) {
  const Compiler = this.Compiler;
  const visitors = Compiler.prototype.visitors;

  function f(this: any, node: Node, _parent?: Parent) {
    return this.encode(node, node).value;
  }

  visitors.text = f;
}

export function generatePreviewMarkdown(tree: Node, position: number) {
  let { parent } = findDeepestChildForPosition(null, tree as Parent, position);

  // Adding this logic to avoid including too large an amount of content. May need additional heuristics to improve this
  // Right now it essentially will just capture the bullet point or paragraph where it is mentioned.
  const maxDepth = 2;
  for (let i = 0; i < maxDepth && parent.parent != null && parent.parent.node.type !== "root"; i++) {
    parent = parent.parent;
  }

  const processor = unified().use(stringifyMd, { commonmark: true }).use(textNoEscaping).freeze();
  return processor.stringify(parent.node);
}

export function generatePreviewHtml(markdownText:string) {
  const previewHtml = unified()
    .use(markdown)
    .use(gfm)
    .use(remark2rehype)
    .use(html)
    .processSync(markdownText)
    .toString();

  return previewHtml;
}
