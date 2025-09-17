import {Content, Emphasis, Heading, List, Paragraph as MdParagraph, Root, RootContent, Strong, Text, Image as MdImage, Link} from "mdast";
import chalk from "chalk";
import {Paragraph, TextRun, ImageRun, AlignmentType, PageBreak, ExternalHyperlink} from "docx";
import Typograf from "typograf";
import { ImageConverter } from "./ImageConverter";

export class Converter {
  private readonly typograf: Typograf;

  private readonly imageConverter: ImageConverter;

  constructor() {
    this.typograf = new Typograf({
      locale: ['ru', 'en-US'],
      disableRule: [
        'common/space/delTrailingBlanks',
        'common/space/delLeadingBlanks',
        'common/space/trimLeft',
        'common/space/trimRight'
      ]
    });

    this.imageConverter = new ImageConverter();
  }

  convert = async (source: Root): Promise<Paragraph[]> => {
    console.log(`${chalk.blue('Конвертация...')}`);

    const nodes: Paragraph[] = [];

    for (let child of source.children) {
      const paragraph = await this.convertNode(child);

      if (!paragraph)
        continue;

      if (Array.isArray(paragraph))
        nodes.push(...paragraph);
      else
        nodes.push(paragraph);
    }

    return nodes;
  };

  private convertNode = async (node: RootContent): Promise<Paragraph | Paragraph[] | null> => {
    switch (node.type) {
      case "heading": {
        const level = (node as Heading).depth;
        const style = `Heading${Math.min(level, 3)}`;
        return new Paragraph({
          children: await this.convertChildren(node.children),
          pageBreakBefore: level === 1,
          style,
        });
      }

      case "paragraph": {
        if (node.children[0]?.type === "image") {
          const {url, alt} = node.children[0] as MdImage;
          const imgRun = await this.imageConverter.convert(url, alt ?? undefined);

          if (!imgRun) return null;

          return [
            new Paragraph({
              children: [imgRun],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: alt ?? url,
              style: "ImageCaption",
            })
          ];
        }

        return new Paragraph({
          children: await this.convertChildren((node as MdParagraph).children),
          style: "Normal",
        });
      }

      case "list": {
        const listNode = node as List;
        const children: Paragraph[] = [];

        for (const item of listNode.children) {
          children.push(new Paragraph({
            children: await this.convertChildren(item.children),
            numbering: {
              reference: listNode.ordered ? "numbering" : "bullet",
              level: 0,
            },
          }));
        }

        return children;
      }

      case "thematicBreak": {
        return new Paragraph({
          children: [new PageBreak()]
        });
      }

      default:
        return null;
    }
  };

  private convertChildren = async (children: Content[]): Promise<(TextRun | ImageRun | ExternalHyperlink)[]> => {
    const runs: (TextRun | ImageRun | ExternalHyperlink)[] = [];

    for (const child of children) {
      switch (child.type) {
        case "text":
          runs.push(new TextRun(this.typograf.execute((child as Text).value)));
          break;

        case "strong":
          runs.push(new TextRun({
            text: this.getPlainText((child as Strong).children),
            bold: true,
          }));
          break;

        case "emphasis":
          runs.push(new TextRun({
            text: this.getPlainText((child as Emphasis).children),
            italics: true,
          }));
          break;

        case "link": {
          const linkNode = child as Link;
          const displayText = this.getPlainText(linkNode.children) || linkNode.url;

          runs.push(new ExternalHyperlink({
            link: linkNode.url,
            children: [
              new TextRun({
                text: this.typograf.execute(displayText),
                style: "Hyperlink",
              }),
            ],
          }));

          break;
        }

        default:
          if ("children" in child)
            runs.push(...await this.convertChildren((child as any).children));
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
