import { remark } from "remark";
import { Root } from "mdast";
import chalk from "chalk";
import remarkGfm from "remark-gfm";

export class MdParser {
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse = (): Root => {
    console.log(`${chalk.blue('Парсинг...')}`);

    return remark().use(remarkGfm).parse(this.source);
  };
}
