type InlineElement = "TEXT" | "BOLD" | "ITALIC" | "INLINECODE";
type Headers = "H1" | "H2" | "H3" | "H4" | "H5" | "H6";
type BlockElement = Headers | "PARAGRAPH" | "CODE" | "ORDERED" | "UNORDERED";
const Header = ["#", "##", "###", "####", "#####", "######"];
const Code = "```";
// type Unordered = "- "

type InlineNode = {
    element: InlineElement;
    text: string;
    children: InlineNode[];
};

type BlockNode = {
    element: BlockElement;
    children: InlineNode[];
};

export function rawToMarkdown(body: string) {
    const blocks = body.split("\n\n");
    const htmlNodes: BlockNode[] = [];

    for (const block of blocks) {
        handleBlock(block, htmlNodes);
    }
}

function handleBlock(block: string, htmlNodes: BlockNode[]) {
    console.log(JSON.stringify(block));

    if (/^#{1,6}\s/.test(block)) {
        handleHeader(block);
    } else if (/^```\n/.test(block) && /\n```$/.test(block)) {
        handleCode(block);
    } else if (/^\*\s/.test(block) || /^-\s/.test(block)) {
        handleUnordered(block);
    } else if (/^\d+\.\s/.test(block)) {
        handleOrdered(block);
    } else {
        handleParagraph(block);
    }
}

function handleInline(text: string) {
  
}

function handleHeader(block: string) {
    const parts = block.split(/\s+/);
    const inlineBlock = handleInline(parts[1]);
    console.log(`Is a H${parts[0].length}`);
}

function handleCode(block: string) {
    const parts = block.split("\n");
    const code = parts.slice(1, -1).join("\n");
    console.log("Is a code block");
    console.log("Code:", JSON.stringify(code));
}

function handleParagraph(block: string) {
    console.log("Is a paragraph");
}

function handleUnordered(block: string) {
    console.log("Is an unordered list");
}

function handleOrdered(block: string) {
    console.log("Is an ordered list");
}
