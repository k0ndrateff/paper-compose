import {BaseConverter} from "./BaseConverter";
import {Content, Emphasis, Link, Strong, Text} from "mdast";
import {ExternalHyperlink, ImageRun, TextRun} from "docx";
import Typograf from "typograf";

class ChildrenConverter extends BaseConverter<Content[], (TextRun | ImageRun | ExternalHyperlink)[]> {
  private readonly typograf: Typograf;

  constructor() {
    super();

    this.typograf = new Typograf({
      locale: ['ru', 'en-US'],
      disableRule: [
        'common/space/delTrailingBlanks',
        'common/space/delLeadingBlanks',
        'common/space/trimLeft',
        'common/space/trimRight'
      ]
    });
  }

  convert = (children: Content[]): (TextRun | ImageRun | ExternalHyperlink)[] => {
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
            runs.push(...this.convert((child as any).children));
      }
    }

    return runs;
  };

  getPlainText = (children: Content[]): string => {
    const text = children
      .map((c) => (c.type === "text" ? (c as Text).value : ""))
      .join("");

    return this.typograf.execute(text);
  };
}

export const childrenConverter = new ChildrenConverter();
