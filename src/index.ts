#!/usr/bin/env node
import { program } from 'commander';
import chalk from "chalk";
import * as fs from "node:fs";
import {parseMarkdown} from "./parser";

program
  .name('paper-compose')
  .description('Markdown → DOCX/PDF с авто-форматированием')
  .version('0.1.0')
  .argument('<file>', 'Markdown файл для обработки')
  .option('-o, --output <file>', 'Имя выходного файла')
  .option('--pdf', 'Сгенерировать PDF')
  .option('--template <file>', 'Шаблон reference.docx')
  .action(async (file, options) => {
    console.log(`${chalk.green('Начато преобразование для')} ${chalk.yellow(file)}${chalk.green('...')}`);

    const md = fs.readFileSync(file, 'utf-8');

    console.log(`${chalk.blue('Парсинг...')}`);

    const result = parseMarkdown(md);

    console.log(result);
  });

program.parse(process.argv);
