import { Root, RootContent, RootContentMap} from "mdast";
import chalk from "chalk";
import {Paragraph, Table} from "docx";
import {BaseConverter} from "./BaseConverter";
import {paragraphConverter} from "./ParagraphConverter";
import {headingConverter} from "./HeadingConverter";
import {codeConverter} from "./CodeConverter";
import {listConverter} from "./ListConverter";
import {thematicBreakConverter} from "./ThematicBreakConverter";
import {tableConverter} from "./TableConverter";
import {pcLogger} from "../helpers/pcLogger";

export class Converter {
  convert = async (source: Root): Promise<(Paragraph | Table)[]> => {
    pcLogger.step(`${chalk.blue('Конвертация...')}`);

    const nodes: (Paragraph | Table)[] = [];

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

  private convertNode = async (node: RootContent): Promise<Paragraph | Paragraph[] | Table[] | null> => {
    const converterMap: Partial<Record<keyof RootContentMap, BaseConverter<unknown, unknown>>> = {
      paragraph: paragraphConverter,
      heading: headingConverter,
      code: codeConverter,
      list: listConverter,
      thematicBreak: thematicBreakConverter,
      table: tableConverter,
    };

    if (node.type in converterMap) {
      return await converterMap[node.type]!.convert(node) as Paragraph | Paragraph[] | Table[] | null;
    }
    else {
      return null;
    }
  };
}
