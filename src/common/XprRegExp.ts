import * as XprUtils from './XprUtils';

export default {
  COMMENT: /(?:^|\s)%-\s.*?\s-%(?:\s|$)|(?:^|\s)%\s.*?(?=\n|$)/gs,
  IDENTIFIER: /^[A-Z0-9_]+$/,
  DIRECTORY_PATH: /^\/.*$/,
  KEY: /^[A-Z0-9_]+$/,
  XPATH: /^(?:::)?\/.*$/,
  MULTI: /^\*$/,
  ATTRIBUTE: /^\[[a-zA-Z0-9-]+\]$/,
  CUSTOM: /^'[^' ]+'$/,
} as const satisfies XprUtils.XprRegExp;
