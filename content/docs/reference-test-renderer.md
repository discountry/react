---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Importing**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## 概览

该包提供了一个React的渲染器，可以用来将 React 组件渲染成纯 JavaScript 对象，不需要依赖于 DOM 和原生移动环境。

本质上，该包可以在无需使用浏览器或[jsdom](https://github.com/tmpvar/jsdom)的情况下，轻松地抓取由 React DOM 或 React Native渲染出的平台视图层次结构（类似于DOM树）。

示例：

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

您可以使用 Jest 的快照测试来自动保存一个该 JSON 树文件的副本，并且在您的测试中检查它是否被更改。[了解更多](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

您同样可以通过遍历输出来查找特殊节点，并对相应的节点进行断言。

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer

* [`TestRenderer.create()`](#TestRenderer.create)

### TestRenderer instance

* [`testRenderer.toJSON()`](#testRenderer.toJSON)
* [`testRenderer.toTree()`](#testRenderer.toTree)
* [`testRenderer.update()`](#testRenderer.update)
* [`testRenderer.unmount()`](#testRenderer.unmount)
* [`testRenderer.getInstance()`](#testRenderer.getInstance)
* [`testRenderer.root`](#testRenderer.root)

### TestInstance

* [`testInstance.find()`](#testInstance.find)
* [`testInstance.findByType()`](#testInstance.findByType)
* [`testInstance.findByProps()`](#testInstance.findByProps)
* [`testInstance.findAll()`](#testInstance.findAll)
* [`testInstance.findAllByType()`](#testInstance.findAllByType)
* [`testInstance.findAllByProps()`](#testInstance.findAllByProps)
* [`testInstance.instance`](#testInstance.instance)
* [`testInstance.type`](#testInstance.type)
* [`testInstance.props`](#testInstance.props)
* [`testInstance.parent`](#testInstance.parent)
* [`testInstance.children`](#testInstance.children)

## 参考

### `TestRenderer.create()`

```javascript
TestRenderer.create(element, options);
```

通过传来的 React 元素创建一个 `TestRenderer` 的实例。它并不使用真实的 DOM，但是它依然将组件树完整地渲染到内存，所以您可以对它进行断言。返回的实例拥有以下的方法和属性。

### `testRenderer.toJSON()`

```javascript
testRenderer.toJSON()
```

返回一个表示渲染后的 树 的对象。该树仅包含特定平台的节点，像`<div>` 或 `<View>`和他们的属性（props），但是并不包含任何用户编写的组件。这对于[快照测试](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest)非常方便。

### `testRenderer.toTree()`

```javascript
testRenderer.toTree()
```

返回一个表示渲染后的 树 的对象。和 `toJSON()` 不同，它表示的内容比 `toJSON()` 提供的内容要更加详细，并且包含用户编写的组件。除非您正在测试渲染器（test rendererer）之上编写您自己的断言库，否则您可能并不需要这个方法。

### `testRenderer.update()`

```javascript
testRenderer.update(element)
```

使用新的根元素重新渲染内存中的树。它模拟根元素的一次React更新。如果新的元素和之前的元素有相同的 type 和 key，该树将会被更新；否则，它将重挂载一个新树。

### `testRenderer.unmount()`

```javascript
testRenderer.unmount()
```

卸载内存中的树，触发相应的生命周期事件。

### `testRenderer.getInstance()`

```javascript
testRenderer.getInstance()
```

如果可用的话，返回与根元素相对应的实例。如果根元素是函数组件（functional component），该方法无效，因为函数组件没有实例。

### `testRenderer.root`

```javascript
testRenderer.root
```

返回根元素“测试实例（test instance）”对象，对于断言树中的特殊节点十分有用。您可以利用它来查找其他更深层的“测试实例（test instance）”。

### `testInstance.find()`

```javascript
testInstance.find(test)
```

找到一个 test(testInstance) 返回 true 的后代 测试实例。如果 test(testInstance) 没有正好只对一个 测试实例 返回 true，将会报错。

### `testInstance.findByType()`

```javascript
testInstance.findByType(type)
```

找到一个匹配指定 类型（type）的 后代 测试实例（testInstances），如果不是正好只有一个测试实例匹配指定的 类型（type），将会报错。

### `testInstance.findByProps()`

```javascript
testInstance.findByProps(props)
```

找到匹配指定 属性（props）的 后代 测试实例（testInstances），如果不是正好只有一个测试实例匹配指定的 类型（type），将会报错。

### `testInstance.findAll()`

```javascript
testInstance.findAll(test)
```

找到所有 `test(testInstance)` 等于 `true` 的后代 测试实例（testInstances）。

### `testInstance.findAllByType()`

```javascript
testInstance.findAllByType(type)
```

找到所有匹配指定 类型（type）的 后代 测试实例（testInstances）。

### `testInstance.findAllByProps()`

```javascript
testInstance.findAllByProps(props)
```

找到所有匹配指定 属性（props）的 后代 测试实例（testInstances）。

### `testInstance.instance`

```javascript
testInstance.instance
```

该测试实例（testInstances）相对应的组件的实例。它只能用于 类组件（class components），因为函数组件（functional components）没有实例。它匹配给定的组件内部的 `this` 的值。

### `testInstance.type`

```javascript
testInstance.type
```

该测试实例（testInstance）相对应的组件的类型（type），例如，一个 `<Button />` 组件有一个 `Button` 类型（type）。

### `testInstance.props`

```javascript
testInstance.props
```

该测试实例（testInstance）相对应的组件的属性（props），例如，一个 `<Button size="small" />` 组件的属性（props）为 `{size: 'small'}`。

### `testInstance.parent`

```javascript
testInstance.parent
```

该测试实例的父测试实例。

### `testInstance.children`

```javascript
testInstance.children
```

该测试实例的子测试实例。

## Ideas

您可以将 `createNodeMock` 函数作为选项（option）传递给 `TestRenderer.create`，可以自行模拟refs。`createNodeMock` 接受当前元素作为参数，并且返回一个模拟的 ref 对象。当您要测试一个依赖于 refs 的组件时，它十分有用。

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
