import {Packer, Document, Paragraph, Table} from "docx";
import * as fs from "node:fs";
import chalk from "chalk";
import { DocumentOptions } from "./configuration/DocumentOptions";
import {pcLogger} from "./helpers/pcLogger";
import {FrontmatterConfig} from "./configuration/FrontmatterConfig";

export class PaperDoc {
  private readonly name: string;
  private readonly doc: Document;

  constructor(name: string, config: FrontmatterConfig) {
    this.name = name;

    this.doc = new Document(DocumentOptions.withFrontmatterConfig(config));
  }

  addNodes = (nodes: (Paragraph | Table)[]): void => {
    for (const node of nodes) {
      this.doc.Document.View.add(node);
    }
  }

  save = async (): Promise<void> => {
    pcLogger.step(`${chalk.blue('Сохранение...')}`);

    const buffer = await Packer.toBuffer(this.doc);

    fs.writeFileSync(`${this.name}.docx`, buffer);

    console.log(`${chalk.green('Документ сохранен в')} ${chalk.yellow(`${this.name}.docx`)}${chalk.green('!')}`);
  };
}
