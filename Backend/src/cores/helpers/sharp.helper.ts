import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { promises as fs } from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export interface DimensionDetail {
  width: number;
  fit: 'contain' | 'inside';
  prefix: string;
}

export interface ResizeOption extends FileDimension {
  // Set file folder path
  path: string;
}

export interface FileDimension {
  // set image dimension
  dimensions: Array<DimensionDetail>;
}

@Injectable()
export class SharpHelper {
  private async ensureDir(dirPath: string) {
    await fs.mkdir(dirPath, { recursive: true });
  }

  private buildLocation(relativePath: string) {
    const baseUrl = process.env.APP_URL || 'http://localhost';
    const href = `${baseUrl.replace(/\/+$/, '')}/${relativePath}`;
    return new URL(href);
  }

  private async saveLocal(
    buffer: Uint8Array,
    folder: string,
    filename: string,
  ) {
    const storageRoot = path.resolve(process.cwd(), 'storage');
    const dir = path.join(storageRoot, folder);
    await this.ensureDir(dir);
    const fullPath = path.join(dir, filename);
    await fs.writeFile(fullPath, buffer);
    const relative = path.posix.join(
      folder.replace(/^\/+|\/+$/g, ''),
      filename,
    );
    return this.buildLocation(relative);
  }

  public async resizeAndUpload(
    file: Express.Multer.File,
    option: ResizeOption,
  ): Promise<{ file_path: string; url: string }> {
    const info = await fileTypeFromBuffer(new Uint8Array(file.buffer));
    if (!info) {
      throw new Error('File type not supported');
    }
    let fileUrl: URL;
    if (info.mime.includes('image')) {
      const currentDate = new Date();
      const dateStr = currentDate.toISOString();
      const md5Hash = new Bun.CryptoHasher('md5').update(dateStr).digest('hex');
      let fileBuffer = file.buffer;
      if (info.mime.includes('heic') || info.mime.includes('heif')) {
        const convertHeic = require('heic-convert');
        fileBuffer = await convertHeic({
          buffer: file.buffer, // the HEIC file buffer
          format: 'PNG', // output format
          quality: 1, // the jpeg compression quality, between 0 and 1
        });
      }

      await Promise.all(
        option.dimensions.map(async (dimension) => {
          const buffer = await sharp(fileBuffer)
            .webp({ quality: 95, smartSubsample: true })
            .resize({
              ...dimension,
              fit: dimension.fit,
              background: { r: 255, g: 255, b: 255 },
            })
            .toBuffer();
          const fileName = `${md5Hash}-${dimension.prefix}.webp`;
          await this.saveLocal(new Uint8Array(buffer), option.path, fileName);
        }),
      );

      const originalBuffer = await sharp(fileBuffer).webp().toBuffer();

      // save original file
      const originalFileUrl = await this.saveLocal(
        new Uint8Array(originalBuffer),
        option.path,
        `${md5Hash}.webp`,
      );

      fileUrl = originalFileUrl;
    } else {
      const originalName = `${Date.now()}.${info.ext || 'bin'}`;
      const saved = await this.saveLocal(
        new Uint8Array(file.buffer),
        option.path,
        originalName,
      );
      fileUrl = saved;
    }

    return { file_path: fileUrl.pathname.substring(1), url: fileUrl.href };
  }

  public async delete(originalFile: string, option: FileDimension) {
    const splitOriginalFile = originalFile.split('.');
    const originalName = splitOriginalFile[0];
    const extension = splitOriginalFile[1];

    // delete all resized file and original from local storage
    const storageRoot = path.resolve(process.cwd(), 'storage');
    for (const dimension of option.dimensions) {
      const fileName = originalName + '-' + dimension.prefix + '.' + extension;
      const fullPath = path.join(storageRoot, fileName);
      try {
        await fs.unlink(fullPath);
      } catch {}
    }

    try {
      await fs.unlink(path.join(storageRoot, originalFile));
    } catch {}

    return true;
  }
}
