import fs from 'fs';
import { resolve } from 'path';

export function isValid(command, currentPath, args) {
  switch (command) {
    case 'up':
    case 'ls':
    case '.exit':
      return true;

    case 'cd':
      return !!args[0] && _isExistsSync(currentPath, args[0]);

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
      return !!(args[0] && _isPathForFile(args[0]));

    case 'rn':
      return !!(args[0] && args[1] && _isPathForFile(args[1]));

    default:
      return false;
  }
}

const _isPathForFile = (path) => {
  const dirMarkerRegExp = /[\/\\]/g;
  return !dirMarkerRegExp.test(path);
};

const _isExistsSync = (currentPath, path) => {
  const absolutePath = resolve(currentPath, path);
  return fs.existsSync(absolutePath);
};
