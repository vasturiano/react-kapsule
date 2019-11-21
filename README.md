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

## API reference

```
const MyComponent = fromKapsule(kapsuleComponent, options);
```

### Returns

A React component that includes the methods of the kapsule component available as props.

### Arguments

* kapsuleComponent

Any closure based functional component which accepts prop changes as functional methods. Following the spec in [reusable charts pattern](https://bost.ocks.org/mike/chart/). Can be conveniently defined using the [Kapsule](https://github.com/vasturiano/kapsule) framework. 

* options
 An object with configuration options that can be used to define the React component. For example:
 ```
 {
   wrapperElementType: 'span'
 }
 ```
 
| Option | Type | Default | Description |
| --- | :--: | :--: | --- |
| <b>wrapperElementType</b> | <i>string</i> or <React component>| `'div'` | The type of DOM element used by the underlying [React createElement](https://reactjs.org/docs/react-api.html#createelement) to mount the component. Can be either a tag name string (such as `'div'` or `'span'`) or a [React component](https://reactjs.org/docs/components-and-props.html) type (a class or a function). |
| <b>methodNames</b> | <i>array of strings</i>| `[]` | The list of kapsule component methods that should be available as React component bound methods, instead of direct props. Generally these methods will be called via the component `ref`, i.e. `myComponentRef.current.myMethod(...)`. |
| <b>initPropNames</b> | <i>array of strings</i> | `[]` | The list of props that are intended to be passed as [configuration options](https://github.com/vasturiano/kapsule#generation) to the kapsule component's instantiation call. Modifying the values of these props after the initial mount of the React component will have no effect. |


[npm-img]: https://img.shields.io/npm/v/react-kapsule.svg
[npm-url]: https://npmjs.org/package/react-kapsule
[build-size-img]: https://img.shields.io/bundlephobia/minzip/react-kapsule.svg
[build-size-url]: https://bundlephobia.com/result?p=react-kapsule
[dependencies-img]: https://img.shields.io/david/vasturiano/react-kapsule.svg
[dependencies-url]: https://david-dm.org/vasturiano/react-kapsule
