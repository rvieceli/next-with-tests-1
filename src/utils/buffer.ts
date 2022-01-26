import { Readable } from "stream";

const buffer = async (readable: Readable): Promise<Buffer> => {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export { buffer };
