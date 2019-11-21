import React, { useState, useEffect, useRef, useCallback } from 'react';

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

  const FromKapsuleComp = ({ comp, ...props }) => {
    const domEl = useRef();

    const [prevProps, setPrevProps] = useState({});
    useEffect(() => setPrevProps(props)); // remember previous props

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

  // to bind component methods
  class OuterComp extends React.Component {
    constructor(props) {
      super(props);

      const configOptions = Object.fromEntries(
        initPropNames
          .filter(p => props.hasOwnProperty(p))
          .map(prop => [prop, props[prop]])
      );

      this.state = {
        // instantiate the inner kapsule component with the defined initPropNames
        comp: kapsuleComponent(configOptions)
      }
    }

    // Call a component method
    _call = (method, ...args) =>
      this.state.comp[method] instanceof Function
        ? this.state.comp[method](...args)
        : undefined; // method not found

    render() {
      return <FromKapsuleComp
        comp={this.state.comp}
        {...this.props}
      />;
    };
  }

  // bind external methods
  methodNames.forEach(method =>
    OuterComp.prototype[method] = function(...args) {
      return this._call(method, ...args);
    }
  );

  return OuterComp;
}
