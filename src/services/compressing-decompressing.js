import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export const compress = async (pathFrom, pathTo) => {
  const createCompress = createBrotliCompress();
  const readable = createReadStream(pathFrom);
  const writable = createWriteStream(`${pathTo}.gz`);
  await pipeline(readable, createCompress, writable);
};

export const decompress = async (pathFrom, pathTo) => {
  const createDecompress = createBrotliDecompress();
  const readable = createReadStream(pathFrom);
  const writable = createWriteStream(pathTo);
  await pipeline(readable, createDecompress, writable);
};
