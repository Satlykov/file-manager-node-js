export const parseInput = (input) => {
  let args = input.split(' ');
  const regExp = /["']/g;
  if (regExp.test(args)) {
    const quotesRegExp = /["']/;
    args = args
      .join(' ')
      .split(quotesRegExp)
      .map((arg) => arg.replace(quoteRegExp, ''));
  }
  return args;
};
