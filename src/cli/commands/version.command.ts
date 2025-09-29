import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import { packageJsonPath } from '../../shared/const/config.const.js';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = packageJsonPath
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (! isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.info(`${chalk.blue(' Application version: ')} ${chalk.cyan(version)}`);
    } catch (error: unknown) {
      console.error(chalk.red(` Failed to read version from ${this.filePath} `));

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}
