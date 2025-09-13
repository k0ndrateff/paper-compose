import { remark } from "remark";
import { Root } from "mdast";
import chalk from "chalk";

export class MdParser {
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse = (): Root => {
    console.log(`${chalk.blue('Парсинг...')}`);

    return remark().parse(this.source);
  };
}
