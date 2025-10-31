import { ESLint } from 'eslint';

export const analyzeWithESLint = (files) => {
  const eslint = new ESLint({ overrideConfigFile: '../../eslint-config/.eslintrc.js' });
  return eslint.lintText(files.join('\n'));
};
