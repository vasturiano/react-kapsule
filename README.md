react-kapsule
=============

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![Dependencies][dependencies-img]][dependencies-url]

A React HOC wrapper for [kapsule](https://github.com/vasturiano/kapsule)-style web components.

## Quick start

```
import fromKapsule from 'react-kapsule';
```
or
```
var fromKapsule = require('react-kapsule');
```
or even
```
<script src="//unpkg.com/react-kapsule"></script>
```

## Usage example

### Given a kapsule component:
```
const myKapsule = Kapsule({ 
    props: {
        prop1: {},
        prop2: {}
    },
    ... 
});
```

### Render it in React:
```
const MyKapsuleComponent = fromKapsule(myKapsule);

ReactDOM.render(
    <MyKapsuleComponent
        prop1="a value"
        prop2="another value"
    />, 
    myDOMElement
);
```

[npm-img]: https://img.shields.io/npm/v/react-kapsule.svg
[npm-url]: https://npmjs.org/package/react-kapsule
[build-size-img]: https://img.shields.io/bundlephobia/minzip/react-kapsule.svg
[build-size-url]: https://bundlephobia.com/result?p=react-kapsule
[dependencies-img]: https://img.shields.io/david/vasturiano/react-kapsule.svg
[dependencies-url]: https://david-dm.org/vasturiano/react-kapsule
