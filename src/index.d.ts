import * as React from 'react';
import { KapsuleClosure } from 'kapsule';

interface FromKapsuleOptions {
  wrapperElementType?: string | React.Component;
  nodeMapper?: (node: HTMLElement) => any;
  methodNames?: string[];
  initPropNames?: string[];
}

declare function fromKapsule<Props ={}, Methods = {}>(
  kapsule: KapsuleClosure,
  options?: FromKapsuleOptions
): React.FunctionComponent<Props & { ref?: React.MutableRefObject<Methods | undefined> }>;

export default fromKapsule;