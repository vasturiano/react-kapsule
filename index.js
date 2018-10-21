import React from 'react';

export default function(kapsuleComponent, wrapperElType = 'div', bindMethodNames = [], initProps = []) {
  class FromKapsuleComp extends React.PureComponent {
    constructor(props) {
      super(props);

      const configOptions = Object.assign({}, ...initProps
        .filter(p => props.hasOwnProperty(p))
        .map(prop => ({ [prop]: props[prop] }))
      );

      this.state = {
        comp: kapsuleComponent(configOptions)
      }
    }

    // Call a component method
    _call = (method, ...args) =>
      this.state.comp[method] instanceof Function
        ? this.state.comp[method](...args)
        : undefined; // method not found

    _getDynamicProps = () => {
      const dynamicProps = Object.assign({}, this.props);
      initProps.forEach(initProp => delete dynamicProps[initProp]); // initProps should not be called
      return dynamicProps;
    };

    componentDidMount() {
      Object.keys(this._getDynamicProps()).forEach(p => {
        this._call(p, this.props[p]);
      });
      this.state.comp(this.rootElem);
    }

    componentDidUpdate(prevProps) {
      Object.keys(this._getDynamicProps()).forEach(p => {
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
