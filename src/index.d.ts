import * as React from 'react';
import Kapsule from 'kapsule';

interface FromKapsuleOptions {
  wrapperElementType?: string | React.Component;
  methodNames?: string[];
  initPropNames?: string[];
}

declare function fromKapsule(
  kapsule: Kapsule,
  options?: FromKapsuleOptions
): React.Component;

export default fromKapsule;