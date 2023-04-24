import os from 'os';

export const getSysInfo = (param) => {
  switch (param) {
    case '--eol':
    case '--EOL':
      console.log('EOL:', JSON.stringify(os.EOL));
      break;
    case '--cpus':
      console.log('Overall amount of CPUS:', os.cpus().length);
      console.table(
        os
          .cpus()
          .map((cpu) => ({
            Model: cpu.model.trim(),
            Rate: `${cpu.speed / 1000} GHz`,
          }))
      );
      break;
    case '--homedir':
      console.log('Home directory:', os.homedir());
      break;
    case '--username':
      console.log('System user name:', os.userInfo().username);
      break;
    case '--architecture':
      console.log('This processor architecture is:', process.arch);
      break;
  }
};
