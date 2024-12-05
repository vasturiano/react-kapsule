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

export default function(kapsuleComponent, {
  wrapperElementType = 'div',
  nodeMapper = node => node,
  methodNames = [],
  initPropNames = []
} = {}) {

  return forwardRef((props, ref) => {
    const domEl = useRef();

    // instantiate the inner kapsule component with the defined initPropNames
    const comp = useMemo(() => {
      const configOptions = Object.fromEntries(
        initPropNames
          .filter(p => props.hasOwnProperty(p))
          .map(prop => [prop, props[prop]])
      );

      return kapsuleComponent(configOptions);
    }, []);

    useEffectOnce(() => {
      comp(nodeMapper(domEl.current)); // mount kapsule synchronously on this element ref, optionally mapped into an object that the kapsule understands
    }, useLayoutEffect);

    useEffectOnce(() => {
      // invoke destructor on unmount, if it exists
      return comp._destructor instanceof Function ? comp._destructor : undefined;
    });

    // Call a component method
    const _call = useCallback((method, ...args) =>
      comp[method] instanceof Function
        ? comp[method](...args)
        : undefined // method not found
    , [comp]);

    // propagate component props that have changed
    const prevPropsRef = useRef({});
    Object.keys(omit(props, [...methodNames, ...initPropNames])) // initPropNames or methodNames should not be called
      .filter(p => prevPropsRef.current[p] !== props[p])
      .forEach(p => _call(p, props[p]));
    prevPropsRef.current = props;

    // bind external methods to parent ref
    useImperativeHandle(ref, () => Object.fromEntries(
      methodNames.map(method =>
        [
          method,
          (...args) => _call(method, ...args)
        ]
      )
    ), [_call]);

    return React.createElement(wrapperElementType, { ref: domEl });
  });
}

//

// Handle R18 strict mode double mount at init
function useEffectOnce(effect, useEffectFn = useEffect) {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [val, setVal] = useState(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffectFn(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) return;
      if (destroyFunc.current) destroyFunc.current();
    };
  }, []);
}
