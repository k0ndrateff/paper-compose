import chalk from "chalk";

class Logger {
  step = (text: string) => {
    console.log(chalk.green(`◈ ${text}`));
  };
}

export const pcLogger = new Logger();
