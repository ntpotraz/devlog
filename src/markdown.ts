// I've updated the type definitions to better represent the structure of a Markdown document.
// This allows for a more flexible Abstract Syntax Tree (AST) that can handle nested elements like list items.
type InlineElement = "TEXT" | "BOLD" | "ITALIC" | "INLINECODE";
type BlockElement =
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "H6"
  | "PARAGRAPH"
  | "CODE"
  | "ORDERED_LIST"
  | "UNORDERED_LIST"
  | "LIST_ITEM";

interface BaseNode {
  element: InlineElement | BlockElement;
}

interface InlineNode extends BaseNode {
  element: InlineElement;
  text?: string;
  children?: InlineNode[];
}

interface BlockNode extends BaseNode {
  element: BlockElement;
  children: (InlineNode | BlockNode)[];
}

/**
 * Converts a raw markdown string into an HTML string.
 * This is the main function to use for conversion.
 * @param body The raw markdown string.
 * @returns The generated HTML string.
 */
export function markdownToHtml(body: string): string {
  const ast = rawToMarkdown(body);
  return astToHtml(ast);
}

/**
 * Parses a raw markdown string into an Abstract Syntax Tree (AST).
 * @param body The raw markdown string.
 * @returns An array of BlockNode representing the document structure.
 */
function rawToMarkdown(body: string): BlockNode[] {
  const blocks = body.split("\n\n");
  const ast: BlockNode[] = [];

  for (const block of blocks) {
    if (block.trim() === "") continue;
    const node = handleBlock(block);
    if (node) {
      ast.push(node);
    }
  }
  return ast;
}

function handleBlock(block: string): BlockNode | null {
  if (/^#{1,6}\s/.test(block)) {
    return handleHeader(block);
  } else if (block.startsWith("```") && block.endsWith("```")) {
    return handleCode(block);
  } else if (/^(\*|-)\s/.test(block)) {
    return handleUnordered(block);
  } else if (/^\d+\.\s/.test(block)) {
    return handleOrdered(block);
  } else {
    return handleParagraph(block);
  }
}

function handleInline(text: string): InlineNode[] {
  const tokens = text.split(/(\*\*\*|\*\*|\*|`)/g).filter(Boolean);
  let i = 0;

  function parse(endMarker: string | null): InlineNode[] {
    const result: InlineNode[] = [];
    while (i < tokens.length) {
      const token = tokens[i];

      if (token === endMarker) {
        if (endMarker) {
          i++;
        }
        return result;
      }

      let node: InlineNode | null = null;

      if (token === "**") {
        i++;
        node = { element: "BOLD", children: parse("**") };
      } else if (token === "*") {
        i++;
        node = { element: "ITALIC", children: parse("*") };
      } else if (token === "`") {
        i++;
        node = { element: "INLINECODE", text: "" };
        if (i < tokens.length && tokens[i] !== "`") {
          node.text = tokens[i];
          i++;
        }
        if (i < tokens.length && tokens[i] === "`") {
          i++;
        }
      } else {
        node = { element: "TEXT", text: token };
        i++;
      }
      if (node) {
        result.push(node);
      }
    }
    return result;
  }

  return parse(null);
}

function handleHeader(block: string): BlockNode {
  const match = block.match(/^(#{1,6})\s+(.*)$/);
  const level = match?.[1].length as 1 | 2 | 3 | 4 | 5 | 6;
  const content = match?.[2];
  return {
    element: `H${level}` as BlockElement,
    children: handleInline(content as string),
  };
}

function handleCode(block: string): BlockNode {
  const lines = block.split("\n");
  const code = lines.slice(1, -1).join("\n");
  return {
    element: "CODE",
    children: [{ element: "TEXT", text: code }],
  };
}

function handleParagraph(block: string): BlockNode {
  return {
    element: "PARAGRAPH",
    children: handleInline(block.replace(/\n/g, " ")),
  };
}

function handleUnordered(block: string): BlockNode {
  const items = block.split("\n").map((item) => item.replace(/^(\*|-)\s+/, ""));
  return {
    element: "UNORDERED_LIST",
    children: items.map(
      (item) =>
        ({
          element: "LIST_ITEM",
          children: handleInline(item),
        }) as BlockNode,
    ),
  };
}

function handleOrdered(block: string): BlockNode {
  const items = block.split("\n").map((item) => item.replace(/^\d+\.\s+/, ""));
  return {
    element: "ORDERED_LIST",
    children: items.map(
      (item) =>
        ({
          element: "LIST_ITEM",
          children: handleInline(item),
        }) as BlockNode,
    ),
  };
}

/**
 * Converts an AST into an HTML string.
 * @param nodes An array of nodes from the AST.
 * @returns The generated HTML string.
 */
function astToHtml(nodes: (BlockNode | InlineNode)[]): string {
  return nodes
    .map((node) => {
      switch (node.element) {
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6": {
          const level = node.element.substring(1);
          return `<h${level}>${astToHtml((node as BlockNode).children)}</h${level}>`;
        }
        case "PARAGRAPH":
          return `<p>${astToHtml((node as BlockNode).children)}</p>`;
        case "CODE": {
          const codeContent =
            ((node as BlockNode).children[0] as InlineNode).text || "";
          return `<pre><code>${escapeHtml(codeContent)}</code></pre>`;
        }
        case "UNORDERED_LIST":
          return `<ul>${astToHtml((node as BlockNode).children)}</ul>`;
        case "ORDERED_LIST":
          return `<ol>${astToHtml((node as BlockNode).children)}</ol>`;
        case "LIST_ITEM":
          return `<li>${astToHtml((node as BlockNode).children)}</li>`;
        case "TEXT":
          return escapeHtml((node as InlineNode).text || "");
        case "BOLD":
          return `<strong>${astToHtml((node as InlineNode).children || [])}</strong>`;
        case "ITALIC":
          return `<em>${astToHtml((node as InlineNode).children || [])}</em>`;
        case "INLINECODE":
          return `<code>${escapeHtml((node as InlineNode).text || "")}</code>`;
        default:
          return "";
      }
    })
    .join("");
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return match;
    }
  });
}
