import {Packer, Document, Paragraph, TextRun} from "docx";
import * as fs from "node:fs";
import {Content, Paragraph as MdParagraph, Emphasis, List, Root, RootContent, Strong, Text, Heading} from "mdast";
import chalk from "chalk";
import {cm, pt} from "./helpers/measures";
import Typograf from "typograf";

export class PaperDoc {
  private readonly name: string;
  private readonly doc: Document;

  private readonly typograf: Typograf;

  constructor(name: string) {
    this.name = name;

    this.typograf = new Typograf({ locale: ['ru', 'en-US'], disableRule: ['common/space/delTrailingBlanks', 'common/space/delLeadingBlanks', 'common/space/trimLeft', 'common/space/trimRight'] });

    this.doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Times New Roman",
              size: pt(14),
            },
            paragraph: {
              alignment: "both",
              spacing: {
                line: 360,   // полуторный интервал
                after: 0,
              },
              indent: {
                firstLine: 720, // абзацный отступ = 0.5"
              },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              size: pt(16),
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: cm(2),
                right: cm(1),
                bottom: cm(2),
                left: cm(3),
              },
            },
          },
          children: [],
        },
      ],
    });
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
  };

  private convertNode = (node: RootContent): Paragraph | Paragraph[] | null => {
    switch (node.type) {
      case "heading": {
        const level = (node as Heading).depth;
        const style = `Heading${Math.min(level, 3)}`; // поддерживаем только 1-3
        return new Paragraph({
          children: this.convertChildren(node.children),
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
        return listNode.children.map((item, i) =>
          new Paragraph({
            children: this.convertChildren(item.children),
            bullet: listNode.ordered ? undefined : { level: 0 }, // маркированный список
            numbering: listNode.ordered
              ? {
                reference: "numbering",
                level: 0,
              }
              : undefined,
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
