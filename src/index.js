import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { omit } from 'jerrypick';

export default function(kapsuleComponent, wrapperElType = 'div', bindMethodNames = [], initProps = []) {

  const FromKapsuleComp = props => {
    const domEl = useRef();

    const [prevProps, setPrevProps] = useState({});
    useEffect(() => setPrevProps(props)); // remember previous props

    // instantiate the inner kapsule component with the defined initProps
    const comp = useMemo(() => {
      const configOptions = Object.fromEntries(
        initProps
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
    const dynamicProps = omit(props, [...bindMethodNames, ...initProps]); // initProps or methodNames should not be called
    Object.keys(dynamicProps)
      .filter(p => prevProps[p] !== props[p])
      .forEach(p => _call(p, props[p]));

    return React.createElement(wrapperElType, { ref: domEl });
  };

  bindMethodNames.forEach(method =>
    FromKapsuleComp.prototype[method] = function(...args) {
      return this._call(method, ...args);
    }
  );

  return FromKapsuleComp;
}
