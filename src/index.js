import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { omit } from 'jerrypick';

export default function(kapsuleComponent, comboParam, ...restArgs) {

  const {
    wrapperElementType = 'div',
    methodNames = [],
    initPropNames = []
  } = typeof comboParam === 'object'
    ? comboParam
    : { // support old schema for backwards compatibility
      wrapperElementType: comboParam,
      methodNames: restArgs[0] || undefined,
      initPropNames: restArgs[1] || undefined
    };

  const FromKapsuleComp = props => {
    const domEl = useRef();

    const [prevProps, setPrevProps] = useState({});
    useEffect(() => setPrevProps(props)); // remember previous props

    // instantiate the inner kapsule component with the defined initPropNames
    const comp = useMemo(() => {
      const configOptions = Object.fromEntries(
        initPropNames
          .filter(p => props.hasOwnProperty(p))
          .map(prop => [prop, props[prop]])
      );

      return kapsuleComponent(configOptions);
    }, []);

    useEffect(() => {
      // mount kapsule on this element ref
      comp(domEl.current);

      // invoke destructor on unmount, if it exists
      return (comp._destructor instanceof Function) && comp._destructor;
    }, []);

    // Call a component method
    const _call = useCallback((method, ...args) =>
      comp[method] instanceof Function
        ? comp[method](...args)
        : undefined // method not found
    , [comp]);

    // propagate component props that have changed
    const dynamicProps = omit(props, [...methodNames, ...initPropNames]); // initPropNames or methodNames should not be called
    Object.keys(dynamicProps)
      .filter(p => prevProps[p] !== props[p])
      .forEach(p => _call(p, props[p]));

    return React.createElement(wrapperElementType, { ref: domEl });
  };

  methodNames.forEach(method =>
    FromKapsuleComp.prototype[method] = function(...args) {
      return this._call(method, ...args);
    }
  );

  return FromKapsuleComp;
}
