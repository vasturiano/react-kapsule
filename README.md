# react-kapsule

A React HOC wrapper for [kapsule](https://github.com/vasturiano/kapsule)-style web components.

[![NPM](https://nodei.co/npm/react-kapsule.png?compact=true)](https://nodei.co/npm/react-kapsule/)

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