#!/usr/bin/env node
import { program } from 'commander';
import chalk from "chalk";
import * as fs from "node:fs";
import { MdParser } from "./MdParser";
import { PaperDoc } from "./PaperDoc";
import { Converter } from "./converters/Converter";

program
  .name('paper-compose')
  .description('Markdown → DOCX/PDF с авто-форматированием')
  .version('0.3.1')
  .argument('<file>', 'Markdown файл для обработки')
  .action(async file => {
    console.log(`${chalk.green('Начато преобразование для')} ${chalk.yellow(file)}${chalk.green('...')}`);

    const md = fs.readFileSync(file, 'utf-8');

    const result = new MdParser(md).parse();
    const doc = new PaperDoc(file.split('.md')[0]);

    const converter = new Converter();

    doc.addNodes(await converter.convert(result));
    await doc.save();
  });

program.parse(process.argv);
