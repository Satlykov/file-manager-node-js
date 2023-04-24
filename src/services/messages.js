export class Messages {
  // \x1b - hexadecimal code for changing color of text
  invalidInput = '\x1b[33mInvalid input \x1b[0m \n'; //33 - Yellow color
  operationFailed = '\x1b[31mOperation failed\x1b[0m \n'; //31 - Red color
  operationSuccessful = '\x1b[32mOperation successful!\x1b[0m \n'; //32 - Green color

  constructor() {
    this._userName = `\x1b[36m${this._getUserName()}\x1b[0m`; //36 - Cyan color
  }

  _getUserName() {
    const args = process.argv.slice(2);
    const lastArg = args[args.length - 1];

    return lastArg?.includes('--username=')
      ? lastArg.replace('--username=', '').trim() || 'anonymous user'
      : 'anonymous user';
  }

  startMessage() {
    console.log(`Welcome to the File Manager, ${this._userName}!`);
  }

  endMessage() {
    console.log(
      `Thank you for using File Manager, ${this._userName}, goodbye!`
    );
  }

  currentlyIn(path) {
    return `You are currently in ${path}\n`;
  }
}
