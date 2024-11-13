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

import fromEntries from 'fromentries';

const shallowEq = (o1, o2) => Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every((k) => o1[k] === o2[k]);

export default function(kapsuleComponent, comboParam, ...restArgs) {

  const {
    wrapperElementType = 'div',
    nodeMapper = node => node,
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
    useEffect(() => { !shallowEq(props, prevProps) && setPrevProps(props) }); // remember previous props

    // instantiate the inner kapsule component with the defined initPropNames
    const comp = useMemo(() => {
      const configOptions = fromEntries(
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
