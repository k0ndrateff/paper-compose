import {Packer, Document, Paragraph} from "docx";
import * as fs from "node:fs";
import chalk from "chalk";
import {DocumentOptions} from "./DocumentOptions";

export class PaperDoc {
  private readonly name: string;
  private readonly doc: Document;

  constructor(name: string) {
    this.name = name;

    this.doc = new Document(DocumentOptions.default);
  }

  addNodes(nodes: Paragraph[]) {
    for (const node of nodes) {
      this.doc.Document.View.add(node);
    }
  }

  save = async (): Promise<void> => {
    console.log(`${chalk.blue('Сохранение...')}`);

    const buffer = await Packer.toBuffer(this.doc);

    fs.writeFileSync(`${this.name}.docx`, buffer);

    console.log(`${chalk.green('Документ сохранен в')} ${chalk.yellow(`${this.name}.docx`)}${chalk.green('!')}`);
  };
}
