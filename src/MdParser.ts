import { remark } from "remark";
import { Root } from "mdast";
import chalk from "chalk";
import remarkGfm from "remark-gfm";
import {pcLogger} from "./helpers/pcLogger";
import remarkFrontmatter from "remark-frontmatter";

export class MdParser {
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse = (): Root => {
    pcLogger.step(`${chalk.blue('Парсинг...')}`);

    return remark().use(remarkGfm).use(remarkFrontmatter).parse(this.source);
  };
}
