import {BaseConverter} from "./BaseConverter";
import {PageBreak, Paragraph} from "docx";

class ThematicBreakConverter extends BaseConverter<undefined, Paragraph> {
  convert = (): Paragraph => {
    return new Paragraph({
      children: [new PageBreak()]
    });
  };
}

export const thematicBreakConverter = new ThematicBreakConverter();
