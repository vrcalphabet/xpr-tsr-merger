export enum XprValueType {
  KEY,
  XPATH,
  MULTI,
  ATTRIBUTE,
  CUSTOM,
  /** 波括弧の左(`{`) */
  BRACKET_OPEN,
  /** 波括弧の右(`}`) */
  BRACKET_CLOSE,
  /** カンマ(`,`) */
  COMMA,
}

export type XprErrorMessages = {
  readonly [key: string]: XprErrorMessageGroup;
};
export type XprErrorMessageGroup = {
  readonly [key: string]: string;
};

export type XprRegExp = {
  readonly [key: string]: RegExp;
};
