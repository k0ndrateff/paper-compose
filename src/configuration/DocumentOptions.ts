import { AlignmentType, Footer, IPropertiesOptions, PageNumber, Paragraph, TableOfContents, TextRun } from "docx";
import { cm, pt } from "../helpers/measures";
import {FrontmatterConfig} from "./FrontmatterConfig";

export class DocumentOptions {
  static get default(): IPropertiesOptions {
    return {
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
                firstLine: cm(1.25)
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
              size: pt(18),
              allCaps: true,
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: "TOCHeading",
            name: "TOC Heading",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              size: pt(18),
              allCaps: true,
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
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
          {
            id: "Heading3",
            name: "Heading 3",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              size: pt(14),
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: "ImageCaption",
            name: "Image Caption",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              italics: true,
              size: pt(14),
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 120 },
            },
          },
          {
            id: "Code",
            name: "Code",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Courier New",
              size: pt(10),
            },
            paragraph: {
              alignment: AlignmentType.LEFT,
              spacing: { line: 240, before: 0, after: 120 },
              indent: { firstLine: 0 },
            },
          },
          {
            id: "Prefix",
            name: "Prefix",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              italics: true,
              size: pt(12),
            },
            paragraph: {
              spacing: { line: 240, before: 240, after: 0 },
              indent: { firstLine: 0 },
            },
          },
          {
            id: "TableCell",
            name: "TableCell",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: pt(12),
            },
            paragraph: {
              spacing: { line: 240, before: 0, after: 0 },
              indent: { firstLine: 0 },
              alignment: AlignmentType.JUSTIFIED,
            },
          },
        ],
      },
      numbering: {
        config: [
          {
            reference: "numbering",
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.",
                alignment: "left",
              },
              {
                level: 1,
                format: "decimal",
                text: "%2)",
                alignment: "left",
              },
            ],
          },
          {
            reference: "bullet",
            levels: [
              {
                level: 0,
                format: "bullet",
                text: "•",
                alignment: "left",
              },
            ],
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
              pageNumbers: {
                start: 1,
              },
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      font: "Times New Roman",
                      size: pt(12),
                      color: "808080",
                    }),
                  ],
                }),
              ],
            }),
            first: new Footer({
              children: [],
            }),
          },
          children: [
            new Paragraph({
              text: "СОДЕРЖАНИЕ",
              style: "TOCHeading",
            }),
            new TableOfContents("Оглавление", {
              hyperlink: true,
              headingStyleRange: "1-3",
            }),
          ],
        },
      ],
    };
  }

  static withFrontmatterConfig(config: FrontmatterConfig): IPropertiesOptions {
    const configOptions: Partial<IPropertiesOptions> = {
      title: config.title,
      description: config.description,
      creator: config.author
    };

    return  { ...DocumentOptions.default, ...configOptions };
  }
}
