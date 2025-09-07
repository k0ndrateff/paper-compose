import {Packer, Document, Paragraph, TextRun} from "docx";
import * as fs from "node:fs";
import {Root, RootContent, Text} from "mdast";
import chalk from "chalk";
import {cm, pt} from "./helpers/measures";

export class PaperDoc {
  private readonly name: string;
  private readonly doc: Document;

  constructor(name: string) {
    this.name = name;

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

      if (paragraph)
        this.doc.Document.View.add(paragraph);
    }
  };

  save = async (): Promise<void> => {
    console.log(`${chalk.blue('Сохранение...')}`);

    const buffer = await Packer.toBuffer(this.doc);

    fs.writeFileSync(`${this.name}.docx`, buffer);
  };

  private convertNode = (node: RootContent): Paragraph | null => {
    switch (node.type) {
      case 'heading':
        return new Paragraph({
          children: node.children.map(c => new TextRun(((c as Text).value ?? ''))),
          heading: "Heading1",
          style: "Heading1",
        });

      case 'paragraph':
        return new Paragraph({
          children: node.children.map(c => new TextRun((c as Text).value ?? '')),
          style: "Normal",
        });

      default:
        return null;
    }
  };
}
