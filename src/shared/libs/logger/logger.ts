import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';
import { resolve } from 'node:path';
import { Logger } from './logger.interface.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

function getCurrentModuleDirectoryPath() {
  const filepath = fileURLToPath(import.meta.url);
  return dirname(filepath);
}

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug'
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created...');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(args, message);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error({ err: error, ...args }, message);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(args, message);
  }

  public warning(message: string, ...args: unknown[]): void {
    this.logger.warn(args, message);
  }
}
