import sharp from "sharp";

export async function convertImage(
  input: Buffer,
  from: string,
  to: string,
): Promise<Buffer> {
  let image = sharp(input);

  switch (to) {
    case "png":
      return image.png().toBuffer();

    case "jpg":
    case "jpeg":
      return image.jpeg({ quality: 85 }).toBuffer();

    case "webp":
      return image.webp({ quality: 85 }).toBuffer();

    default:
      throw new Error(`Unsupported image conversion: ${from} → ${to}`);
  }
}
