import { ImageRun } from "docx";
import fs from "fs/promises";
import path from "path";
import sizeOf from "image-size";
import chalk from "chalk";

export class ImageConverter {
  async convert(src: string, alt?: string): Promise<ImageRun | null> {
    let buffer: Buffer;

    try {
      if (src.startsWith("http://") || src.startsWith("https://")) {
        const res = await fetch(src);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        buffer = Buffer.from(await res.arrayBuffer());
      } else {
        const abs = path.resolve(src);
        buffer = await fs.readFile(abs);
      }
    }
    catch {
      console.error(chalk.red(`Не удалось загрузить изображение ${src}. Проверьте путь до файла.`))

      return null;
    }

    const dim = sizeOf(buffer);

    if (!dim.width || !dim.height || !dim.type) {
      console.error(chalk.red(`Не удалось определить размеры или тип изображения: ${src}. Возможно, формат изображения некорректен.`));

      return null;
    }

    const MAX_WIDTH = 500;
    let width = dim.width;
    let height = dim.height;

    if (width > MAX_WIDTH) {
      const ratio = MAX_WIDTH / width;

      width = MAX_WIDTH;
      height = Math.round(height * ratio);
    }

    return new ImageRun({
      data: buffer,
      transformation: {
        width: width,
        height: height,
      },
      type: dim.type as "png" | "jpg" | "gif" | "bmp" | 'svg',
      altText: {
        name: String(alt)
      },
      fallback: {
        type: 'png',
        data: buffer
      }
    });
  }
}
