import { createReadStream, createWriteStream } from 'fs';
import { open, rename, rm } from 'fs/promises';
import { pipeline } from 'stream/promises';

export const cat = async (filePath) => {
  const readable = createReadStream(filePath, 'utf-8');
  readable.pipe(process.stdout);
  const result = new Promise((resolve, reject) => {
    readable.on('end', () => resolve());
    readable.on('error', () => reject());
  });
  await result;
};

export const add = async (filePath) => {
  await open(filePath, 'w');
};

export const rn = async (oldFilePath, newFilePath) => {
  await rename(oldFilePath, newFilePath);
};

export const cp = async (filePath, newFilePath) => {
  const readable = createReadStream(filePath);
  const writable = createWriteStream(newFilePath);

  await pipeline(readable, writable);
};

export const mv = async (filePath, newFilePath) => {
  await cp(filePath, newFilePath);
  await rm(filePath);
};

export const rmFile = async (filePath) => {
  await rm(filePath);
};
