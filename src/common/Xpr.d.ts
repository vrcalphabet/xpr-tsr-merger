export type Xpr = Array<XprGroup>;
export type XprGroup = XprMetadata & XprNodes;
export type XprMetadata = {
  name: string;
  includes: XprPathList;
  excludes: XprPathList;
};
export type XprNodes = {
  nodes: XprNodeList;
};

export type XprParentNode = {
  key: string;
  xpath: string;
  nodes: XprNodeList;
};
export type XprChildNode = {
  key: string | null;
  xpath: string;
  multi: boolean;
  attribute: string | null;
};

export type XprPathList = Array<string>;
export type XprNodeList = Array<XprParentNode | XprChildNode>;
