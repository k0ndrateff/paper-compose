import {BaseConverter} from "./BaseConverter";
import {Code} from "mdast";
import {Paragraph, TextRun} from "docx";

class CodeConverter extends BaseConverter<Code, Paragraph[]> {
  private codeListingCount = 0;

  convert = (node: Code): Paragraph[] => {
    this.codeListingCount++;

    const code = (node as Code).value;
    const lines = code.split(/\r?\n/);

    const runs: TextRun[] = [];

    lines.forEach((line, idx) => {
      runs.push(new TextRun({ break: idx > 0 ? 1 : 0, text: line }));
    });

    return [
      new Paragraph({
        children: [new TextRun(`Листинг ${this.codeListingCount}`)],
        style: "Prefix",
      }),

      new Paragraph({
        children: runs,
        style: "Code",
        border: {
          top: { color: "000000", space: 1, size: 8, style: "single" },
          bottom: { color: "000000", space: 1, size: 8, style: "single" },
          left: { color: "000000", space: 1, size: 8, style: "single" },
          right: { color: "000000", space: 1, size: 8, style: "single" },
        },
      }),
    ];
  };
}

export const codeConverter = new CodeConverter();
