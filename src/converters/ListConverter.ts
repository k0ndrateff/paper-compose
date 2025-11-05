import {BaseConverter} from "./BaseConverter";
import {List} from "mdast";
import {Paragraph} from "docx";
import {childrenConverter} from "./ChildrenConverter";

class ListConverter extends BaseConverter<List, Paragraph[]> {
  convert = (node: List): Paragraph[] => {
    const listNode = node as List;
    const children: Paragraph[] = [];

    for (const item of listNode.children) {
      children.push(new Paragraph({
        children: childrenConverter.convert(item.children),
        numbering: {
          reference: listNode.ordered ? "numbering" : "bullet",
          level: 0,
        },
      }));
    }

    return children;
  };
}

export const listConverter = new ListConverter();
