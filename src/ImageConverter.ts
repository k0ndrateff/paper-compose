import {ImageRun} from "docx";
import fs from "fs/promises";
import path from "path";

export class ImageConverter {
  async convert(src: string, alt?: string): Promise<ImageRun | null> {
    try {
      let buffer: Buffer;

      if (src.startsWith("http://") || src.startsWith("https://")) {
        const res = await fetch(src);

        buffer = Buffer.from(await res.arrayBuffer());
      } else {
        const abs = path.resolve(src);

        buffer = await fs.readFile(abs);
      }

      return new ImageRun({
        data: buffer,
        type: 'png',
        transformation: {
          width: 400,
          height: 300,
        },
        altText: {
          name: String(alt),
          title: alt
        }
      });
    } catch (e) {
      console.error("Не удалось загрузить изображение:", src, e);
      return null;
    }
  }
}
