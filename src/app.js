import { resolve } from 'path';
import { homedir } from 'os';
import { createInterface } from 'readline/promises';

import { isValid } from './services/validation.js';
import { Messages } from './services/messages.js';
import { parseInput } from './services/parseInput.js'

export class App {
  constructor() {
    this._messages = new Messages();
    this._currentPath = homedir();
  }

  _pathResolver(p) {
    return resolve(this._currentPath, p);
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

      if (isValid(command, args)) {
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
