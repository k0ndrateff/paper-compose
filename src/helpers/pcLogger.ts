import chalk from "chalk";

class Logger {
  step = (text: string): void => {
    console.log(chalk.green(`◈ ${text}`));
  };

  error = (text: string): void => {
    console.log(chalk.red(`✗ ${text}`))
  };

  warning = (text: string): void => {
    console.log(chalk.yellow(`!? ${text}`))
  };
}

export const pcLogger = new Logger();
