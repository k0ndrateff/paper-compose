import {BaseConverter} from "./BaseConverter";
import {Paragraph as MdParagraph} from "mdast";
import {Paragraph} from "docx";
import {imageConverter} from "./ImageConverter";
import {childrenConverter} from "./ChildrenConverter";

class ParagraphConverter extends BaseConverter<MdParagraph, Promise<Paragraph | Paragraph[] | null>> {
  convert = async (node: MdParagraph): Promise<Paragraph | Paragraph[] | null> => {
    if (node.children[0]?.type === "image") {
      return await imageConverter.convert(node);
    }

    return new Paragraph({
      children: childrenConverter.convert(node.children),
      style: "Normal",
    });
  };
}

export const paragraphConverter = new ParagraphConverter();
