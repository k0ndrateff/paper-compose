import {FrontmatterConfig} from "./FrontmatterConfig";
import {Root, Yaml} from "mdast";
import YAML from "yaml";
import {pcLogger} from "../helpers/pcLogger";
import chalk from "chalk";

export class FrontmatterParser {
  parse = (ast: Root): FrontmatterConfig => {
    const config: FrontmatterConfig = {};

    const node = this.getNode(ast);

    if (!node) return config;

    pcLogger.step(`${chalk.blue('Чтение конфига...')}`);

    const parsedOptions = YAML.parse(node.value);

    for (const [key, value] of Object.entries(parsedOptions)) {
      parsedOptions[key] = value;
    }

    return parsedOptions;
  };

  private getNode = (ast: Root): Yaml | null => {
    for (let node of ast.children) {
      if (node.type === 'yaml') {
        return node;
      }
    }

    return null;
  };
}
