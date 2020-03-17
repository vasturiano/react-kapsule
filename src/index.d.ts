import * as React from 'react';
import { KapsuleClosure } from 'kapsule';

interface FromKapsuleOptions {
  wrapperElementType?: string | React.Component;
  methodNames?: string[];
  initPropNames?: string[];
}

declare function fromKapsule(
  kapsule: KapsuleClosure,
  options?: FromKapsuleOptions
): React.Component;

export default fromKapsule;