import { remark } from "remark";
import { Root } from "mdast";
import chalk from "chalk";
import remarkGfm from "remark-gfm";
import {pcLogger} from "./helpers/pcLogger";

export class MdParser {
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse = (): Root => {
    pcLogger.step(`${chalk.blue('Парсинг...')}`);

    return remark().use(remarkGfm).parse(this.source);
  };
}
