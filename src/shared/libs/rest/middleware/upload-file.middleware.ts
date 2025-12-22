import multer from 'multer';
import { nanoid } from 'nanoid';
import { extension } from 'mime-types';
import { Config, RestSchema } from '../../config/index.js';
import { Middleware } from './middleware.interface.js';

export class UploadFileMiddleware implements Middleware {
  private readonly uploader: multer.Multer;

  constructor(
    config: Config<RestSchema>,
    private readonly fieldName: string,
    maxFileSize: number = 1024 * 1024,
  ) {
    const uploadDirectory = config.get('UPLOAD_DIRECTORY');

    const storage = multer.diskStorage({
      destination: uploadDirectory,
      filename: (_req, file, cb) => {
        const fileExt = extension(file.mimetype);
        const uniqueName = nanoid();
        const filename = fileExt ? `${uniqueName}.${fileExt}` : uniqueName;
        cb(null, filename);
      }
    });

    this.uploader = multer({
      storage,
      limits: { fileSize: maxFileSize },
    });
  }

  public execute(
    req: Parameters<Middleware['execute']>[0],
    res: Parameters<Middleware['execute']>[1],
    next: Parameters<Middleware['execute']>[2]
  ): void {
    this.uploader.single(this.fieldName)(req, res, next);
  }
}
