import { resolve } from 'path';
import { homedir } from 'os';
import { readdir } from 'fs/promises';
import { createInterface } from 'readline/promises';

import { isValid } from './services/validation.js';
import { Messages } from './services/messages.js';
import { parseInput } from './services/parseInput.js';

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
