import {BaseConverter} from "./BaseConverter";
import {Heading} from "mdast";
import {Paragraph} from "docx";
import {childrenConverter} from "./ChildrenConverter";

class HeadingConverter extends BaseConverter<Heading, Paragraph> {
  convert = (node: Heading): Paragraph => {
    const level = node.depth;

    const style = `Heading${Math.min(level, 3)}`;

    return new Paragraph({
      children: childrenConverter.convert(node.children),
      pageBreakBefore: level === 1,
      style,
    });
  };
}

export const headingConverter = new HeadingConverter();
