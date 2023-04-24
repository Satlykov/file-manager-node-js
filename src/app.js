import { resolve, parse } from 'path';
import { homedir } from 'os';
import { readdir } from 'fs/promises';
import { createInterface } from 'readline/promises';

import { isValid } from './services/validation.js';
import { Messages } from './services/messages.js';
import { parseInput } from './services/parseInput.js';
import { cat, add, rn, cp, mv, rmFile } from './services/files.js';
import { getSysInfo } from './services/sysInfo.js';
import { hash } from './services/hash.js';
import { compress, decompress } from './services/compressing-decompressing.js';

export class App {
  constructor() {
    this._messages = new Messages();
    this._currentPath = homedir();
  }

  _pathResolver(p) {
    return resolve(this._currentPath, p);
  }

  up() {
    this._currentPath = this._pathResolver('..');
  }

  cd([path]) {
    this._currentPath = this._pathResolver(path);
  }

  async ls() {
    const list = (await readdir(this._currentPath, { withFileTypes: true }))
      .filter((el) => !el.isSymbolicLink())
      .sort((a, b) => a.isFile() - b.isFile());
    console.table(
      list.map((item) => ({
        Name: item.name,
        Type: item.isFile() ? 'file' : 'directory',
      }))
    );
  }

  async cat([path]) {
    const filePath = this._pathResolver(path);
    await cat(filePath);
  }

  async add([path]) {
    const filePath = this._pathResolver(path);
    await add(filePath);
  }

  async rn([path, newName]) {
    const oldFilePath = this._pathResolver(path);
    const dir = parse(oldFilePath).dir;
    const newFilePath = resolve(dir, newName);
    await rn(oldFilePath, newFilePath);
  }

  async cp([filePath, newFilePath]) {
    const filePathAbsolute = this._pathResolver(filePath);
    const newFilePathAbsolute = this._pathResolver(newFilePath);
    await cp(filePathAbsolute, newFilePathAbsolute);
  }

  async mv([oldPath, newPath]) {
    const filePathAbsolute = this._pathResolver(oldPath);
    const newFilePathAbsolute = this._pathResolver(newPath);
    await mv(filePathAbsolute, newFilePathAbsolute);
  }

  async rm([filePath]) {
    const filePathAbsolute = this._pathResolver(filePath);
    await rmFile(filePathAbsolute);
  }

  os([arg]) {
    getSysInfo(arg);
  }

  async hash([arg]) {
    const filePathAbsolute = this._pathResolver(arg);
    await hash(filePathAbsolute);
  }

  async compress([pathFrom, pathTo]) {
    const filePath = this._pathResolver(pathFrom);
    const compressPath = this._pathResolver(pathTo);
    await compress(filePath, compressPath);
  }

  async decompress([pathFrom, pathTo]) {
    const filePath = this._pathResolver(pathFrom);
    const decompressPath = this._pathResolver(pathTo);
    await decompress(filePath, decompressPath);
  }

  async start() {
    this._messages.startMessage();
    process.on('exit', () => this._messages.endMessage());

    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const input = await readline.question(
        this._messages.currentlyIn(this._currentPath)
      );
      const [command, ...args] = parseInput(input);

      if (isValid(command, this._currentPath, args)) {
        try {
          await this[command](args);
          console.log(this._messages.operationSuccessful);
        } catch {
          console.log(this._messages.operationFailed);
        }
      } else {
        console.log(this._messages.invalidInput);
      }
    }
  }
}
