import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(..._parameters: string[]): void {
    console.info(chalk.italic.blackBright('Программа для подготовки данных для REST API сервера.'));
    console.info(chalk.magenta('Пример: cli.js --<command> [--arguments]'));
    console.info(chalk.red('Команды:'));
    console.info(chalk.cyan('   --version:') + chalk.white('                   # выводит номер версии'));
    console.info(chalk.cyan('   --help:') + chalk.white('                      # печатает этот текст'));
    console.info(chalk.cyan('   --import <path> <DB_USER> <DB_PASSWORD> <DB_HOST> <DB_NAME> <SALT>:') + chalk.white(' # импортирует данные из TSV в MongoDB'));
    console.info(chalk.cyan('    --generate <n> <path> <url>:') + chalk.white(' # генерирует n тестовых предложений и сохраняет по указанному пути'));
  }
}
