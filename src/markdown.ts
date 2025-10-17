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
  | "ORDERED"
  | "UNORDERED";
const Header = ["#", "##", "###", "####", "#####", "######"];
// type Code = "\`\`\`"
// type Unordered = "- "

type InlineText = {
  element: InlineElement;
  text: InlineText[];
};

type BlockText = {
  element: BlockElement;
  text: InlineText;
};

export function rawToMarkdown(body: string) {
  const lines = body.split("\n");

  for (const line of lines) {
    console.log(line);
    const isBlock = checkBlock(line);
    console.log(isBlock);
  }
}

function checkBlock(line: string): BlockText | undefined {
  console.log("Check Block")
  if (line.startsWith("#")) {
    console.log("Line starts with #")
    const sections = line.split(" ", 2);
    if (sections.length > 1) {
      if (Header.includes(sections[0])) {
        console.log("Is Header");
        return {
          element: `H${sections[0].length}` as BlockElement,
          text: handleInline(sections[1]),
        };
      } else {
        console.log(`Not A Header: ${sections[0]}`)
      }
    }
  }
}

function handleInline(text: string): InlineText {
  console.log(text);
  return {} as InlineText;
}
