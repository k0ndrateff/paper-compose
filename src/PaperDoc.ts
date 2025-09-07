import {Packer, Document, Paragraph, TextRun} from "docx";
import * as fs from "node:fs";
import {Content, Paragraph as MdParagraph, Emphasis, List, Root, RootContent, Strong, Text, Heading} from "mdast";
import chalk from "chalk";
import Typograf from "typograf";
import {DocumentOptions} from "./DocumentOptions";

export class PaperDoc {
  private readonly name: string;
  private readonly doc: Document;

  private readonly typograf: Typograf;

  constructor(name: string) {
    this.name = name;

    this.typograf = new Typograf({ locale: ['ru', 'en-US'], disableRule: ['common/space/delTrailingBlanks', 'common/space/delLeadingBlanks', 'common/space/trimLeft', 'common/space/trimRight'] });

    this.doc = new Document(DocumentOptions.default);
  }

  convert = (source: Root): void => {
    console.log(`${chalk.blue('Конвертация...')}`);

    for (let child of source.children) {
      const paragraph = this.convertNode(child);

      if (!paragraph)
        return;

      if (paragraph instanceof Array)
        for (const p of paragraph)
          this.doc.Document.View.add(p);

      this.doc.Document.View.add(paragraph as Paragraph);
    }
  };

  save = async (): Promise<void> => {
    console.log(`${chalk.blue('Сохранение...')}`);

    const buffer = await Packer.toBuffer(this.doc);

    fs.writeFileSync(`${this.name}.docx`, buffer);

    console.log(`${chalk.green('Документ сохранен в')} ${chalk.yellow(`${this.name}.docx`)}${chalk.green('!')}`);
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
