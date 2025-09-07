import {Content, Emphasis, Heading, List, Paragraph as MdParagraph, Root, RootContent, Strong, Text} from "mdast";
import chalk from "chalk";
import {Paragraph, TextRun} from "docx";
import Typograf from "typograf";

export class Converter {
  private readonly typograf: Typograf;

  constructor() {
    this.typograf = new Typograf({
      locale: ['ru', 'en-US'],
      disableRule: ['common/space/delTrailingBlanks', 'common/space/delLeadingBlanks', 'common/space/trimLeft', 'common/space/trimRight']
    });
  }

  convert = (source: Root): Paragraph[] => {
    console.log(`${chalk.blue('Конвертация...')}`);

    const nodes: Paragraph[] = [];

    for (let child of source.children) {
      const paragraph = this.convertNode(child);

      if (!paragraph)
        continue;

      if (paragraph instanceof Array)
        for (const p of paragraph)
          nodes.push(p);

      nodes.push(paragraph as Paragraph);
    }

    return nodes;
  };

  private convertNode = (node: RootContent): Paragraph | Paragraph[] | null => {
    switch (node.type) {
      case "heading": {
        const level = (node as Heading).depth;
        const style = `Heading${Math.min(level, 3)}`;
        return new Paragraph({
          children: this.convertChildren(node.children),
          pageBreakBefore: level <= 2,
          style,
        });
      }

      case "paragraph": {
        return new Paragraph({
          children: this.convertChildren((node as MdParagraph).children),
          style: "Normal",
        });
      }

      case "list": {
        const listNode = node as List;
        return listNode.children.map(item =>
          new Paragraph({
            children: this.convertChildren(item.children),
            numbering: {
              reference: listNode.ordered ? "numbering" : "bullet",
              level: 0,
            },
          })
        );
      }

      default:
        return null;
    }
  };

  private convertChildren = (children: Content[]): TextRun[] => {
    const runs: TextRun[] = [];

    for (const child of children) {
      switch (child.type) {
        case "text":
          runs.push(new TextRun(this.typograf.execute((child as Text).value)));
          break;

        case "strong":
          runs.push(
            new TextRun({
              text: this.getPlainText((child as Strong).children),
              bold: true,
            })
          );
          break;

        case "emphasis":
          runs.push(
            new TextRun({
              text: this.getPlainText((child as Emphasis).children),
              italics: true,
            })
          );
          break;

        default:
          // рекурсия для вложенных случаев
          if ("children" in child) {
            runs.push(...this.convertChildren((child as any).children));
          }
      }
    }

    return runs;
  };

  private getPlainText = (children: Content[]): string => {
    const text = children
      .map((c) => (c.type === "text" ? (c as Text).value : ""))
      .join("");

    return this.typograf.execute(text);
  };
}
