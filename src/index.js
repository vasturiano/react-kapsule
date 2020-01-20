import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle
} from 'react';

import { omit } from 'jerrypick';

import fromEntries from 'fromentries'

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

  return forwardRef((props, ref) => {
    const domEl = useRef();

    const [prevProps, setPrevProps] = useState({});
    useEffect(() => setPrevProps(props)); // remember previous props

    // instantiate the inner kapsule component with the defined initPropNames
    const comp = useMemo(() => {
      const configOptions = fromEntries(
        initPropNames
          .filter(p => props.hasOwnProperty(p))
          .map(prop => [prop, props[prop]])
      );

      return kapsuleComponent(configOptions);
    }, []);

    useLayoutEffect(() => {
      comp(domEl.current); // mount kapsule synchronously on this element ref
    }, []);

    useEffect(() => {
      // invoke destructor on unmount, if it exists
      return comp._destructor instanceof Function ? comp._destructor : undefined;
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

    // bind external methods to parent ref
    useImperativeHandle(ref, () => fromEntries(
      methodNames.map(method =>
        [
          method,
          (...args) => _call(method, ...args)
        ]
      )
    ));

    return React.createElement(wrapperElementType, { ref: domEl });
  });
}
