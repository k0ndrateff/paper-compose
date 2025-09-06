#!/usr/bin/env node
import { program } from 'commander';
import chalk from "chalk";

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
  });

program.parse(process.argv);
