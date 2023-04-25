import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export const hash = async (filePath) => {
  const hash = createHash('sha256');
  const readable = createReadStream(filePath);
  readable.pipe(hash);
  const result = new Promise((resolve, reject) => {
    readable.on('end', () => resolve());
    readable.on('error', () => reject());
  });

  await result;
  console.log(`Hash: ${hash.digest('hex')}`);
};
