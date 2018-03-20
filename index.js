import React from 'react';

export default function(kapsuleComponent, wrapperElType = 'div', bindMethodNames = []) {
  class FromKapsuleComp extends React.PureComponent {
    state = {
      comp: kapsuleComponent()
    };

    // Call a component method
    _call = (method, ...args) =>
      this.state.comp[method] instanceof Function
        ? this.state.comp[method](...args)
        : undefined; // method not found

    componentDidMount() {
      Object.keys(this.props).forEach(p => {
        this._call(p, this.props[p]);
      });
      this.state.comp(this.rootElem);
    }

    componentDidUpdate(prevProps) {
      Object.keys(this.props).forEach(p => {
        if (prevProps[p] !== this.props[p]) {
          this._call(p, this.props[p]);
        }
      });
    }

    componentWillUnmount() {
      // Invoke _destructor, if it exists
      if (this.state.comp._destructor instanceof Function) {
        this.state.comp._destructor();
      }
    }

    render() {
      return React.createElement(
        wrapperElType,
        { ref: elem => { this.rootElem = elem } }
      );
    }
  }

  bindMethodNames.forEach(method => {
    FromKapsuleComp.prototype[method] = function(...args) {
      return this._call(method, ...args);
    }
  });

  return FromKapsuleComp;
}
