#!/usr/bin/env node
import { program } from 'commander';
import chalk from "chalk";
import * as fs from "node:fs";
import { MdParser } from "./MdParser";
import { PaperDoc } from "./PaperDoc";
import { Converter } from "./converters/Converter";
import {pcLogger} from "./helpers/pcLogger";
import {FrontmatterParser} from "./configuration/FrontmatterParser";

program
  .name('paper-compose')
  .description('Markdown → DOCX/PDF с авто-форматированием')
  .version('0.7.0')
  .argument('<file>', 'Markdown файл для обработки')
  .action(async file => {
    console.log(`${chalk.green('Начато преобразование для')} ${chalk.yellow(file)}${chalk.green('...')}`);

    if (!fs.existsSync(file)) {
      pcLogger.error(`Файл ${chalk.yellow(file)} не найден.`);

      process.exit(1);
    }

    const md = fs.readFileSync(file, 'utf-8');

    const result = new MdParser(md).parse();

    const frontmatterConfig = new FrontmatterParser().parse(result);
    const doc = new PaperDoc(file.split('.md')[0], frontmatterConfig);

    const converter = new Converter();

    doc.addNodes(await converter.convert(result));
    await doc.save();
  });

program.parse(process.argv);
