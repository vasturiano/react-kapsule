import React from 'react';

export default function(kapsuleComponent, wrapperElType = 'div') {
  return class extends React.PureComponent {
    state = {
      comp: kapsuleComponent()
    };

    componentDidMount() {
      Object.keys(this.props).forEach(p => {
        this.state.comp[p](this.props[p]);
      });
      this.state.comp(this.rootElem);
    }

    componentDidUpdate(prevProps) {
      Object.keys(this.props).forEach(p => {
        if (prevProps[p] !== this.props[p]) {
          this.state.comp[p](this.props[p]);
        }
      });
    }

    render() {
      return React.createElement(
        wrapperElType,
        { ref: elem => { this.rootElem = elem } }
      );
    }
  }
}
