const args = process.argv.slice(2);
const lastArg = args[args.length - 1];
const userName = lastArg?.includes('--username=')
  ? lastArg.replace('--username=', '').trim() || 'anonymous user'
  : 'anonymous user';

const startMessage = () => {
  console.log(`Welcome to the File Manager, ${userName}!`);
};

const endMessage = () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
};

startMessage();
process.on('exit', () => endMessage());
