import { fs } from 'fs'

export function isValid(command, args) {
  switch (command) {
    case 'up':
    case 'ls':
    case '.exit':
      return true;

    case 'cd':
    case 'cat':
    case 'rm':
    case 'os':
    case 'hash':
      return !!args[0];

    case 'mv':
    case 'cp':
    case 'compress':
    case 'decompress':
      return !!(args[0] && args[1]);

    case 'add':
      return !!(args[0] && _isPathToFile(args[0]));

    case 'rn':
      return !!(args[0] && args[1] && _isPathToFile(args[1]));

    default:
      return false;
  }
}

const _isPathToFile = (filename) => {
  return fs.lstatSync(filename).isFile();
};
