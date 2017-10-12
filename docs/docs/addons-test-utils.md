---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## 概览

`ReactTestUtils`可以在您选择的测试框架中轻松地测试React组件。 在 Facebook 我们使用 [Jest](https://facebook.github.io/jest/) 来愉快地测试 JavaScript。通过 Jest 的网站[React Tutorial](http://facebook.github.io/jest/docs/tutorial-react.html#content)来学习如何开始使用 Jest。

> 注意：
>
> Airbnb（爱彼迎）已经发布了一个名为 Enzyme 的测试工具，该工具可以很容易地对您的 React 组件的输出进行 断言、操作和遍历。如果你正在为选择哪个单元测试工具来和 Jest 或其他测试运行器 协同工作，Enzyme值得一试[http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)。

 - [`Simulate`](#simulate)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)

## 参考

## 浅渲染

当为 React 写单元测试时, 浅渲染会变得十分有用。浅渲染使您渲染组件的“第一层”，并且对组件的 render 方法的返回值进行断言，不用担心子组件的行为，组件并没有实例化或被渲染。浅渲染并不需要 DOM。

> 注意：
>
> 浅渲染已经被移动到了 `react-test-renderer/shallow`.<br>
> [在浅渲染的参考页面了解更多信息。](/react/docs/shallow-renderer.html)

## 其他工具

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

模拟分发一个事件到DOM节点，`eventData` 是可选的事件数据。

[任一个React支持的事件](/react/docs/events.html#supported-events)都是 `Simulate` 的一个方法。

**点击一个元素**

```javascript
// <button ref="button">...</button>
const node = this.refs.button;
ReactTestUtils.Simulate.click(node);
```

**改变一个输入框（input）的值然后按下回车键（ENTER）.**

```javascript
// <input ref="input" />
const node = this.refs.input;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> 注意：
>
> 您必须提供 所有 在你的组件中正在使用的 事件属性（例如 keyCode, which,等等），因为 React 并不会为您创建这些东西。

* * *

### `renderIntoDocument()`

```javascript
renderIntoDocument(element)
```

将一个 React 元素渲染到 document 中的一个独立的 DOM 节点。 **这个函数需要DOM**

> 注意：
>
> 在导入 React 之前， 您必须拥有全局可用的 `window`, `window.document` 和 `window.document.createElement`。否则， React 会认为它不能访问 DOM 并且像 `setState` 这样的方法将不能工作。

* * *

### `mockComponent()`

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Pass a mocked component module to this method to augment it with useful methods that allow it to be used as a dummy React component. Instead of rendering as usual, the component will become a simple `<div>` (or other tag if `mockTagName` is provided) containing any provided children.

> 注意：
>
> `mockComponent()` 是一个历史遗留的 API. 我们建议使用 [shallow rendering](/react/docs/test-utils.html#shallow-rendering) 或 [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) 来代替。

* * *

### `isElement()`

```javascript
isElement(element)
```

如果 `element` 是任一 React 元素，返回 `true`。

* * *

### `isElementOfType()`

```javascript
isElementOfType(
  element,
  componentClass
)
```

如果 `element` 是一个类型为 `componentClass` 的 React 元素，返回 `true`。

* * *

### `isDOMComponent()`

```javascript
isDOMComponent(instance)
```

如果 `instance` 是一个 DOM 组件（例如一个 `<div>` 或 `<span>`），返回 `true`。

* * *

### `isCompositeComponent()`

```javascript
isCompositeComponent(instance)
```

如果 `instance` 是一个用户自定义的组件，例如一个类或者一个函数，返回 `true`。

* * *

### `isCompositeComponentWithType()`

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

如果 `instance` 是一个类型为 `componentClass` 的组件，返回 `true`。

* * *

### `findAllInRenderedTree()`

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

遍历 `tree` 中的所有组件，并且搜集所有 `test(component)` 为 `true` 的组件。它单独使用时不是很有用，但是它被用作其他测试工具的原始数据。

* * *

### `scryRenderedDOMComponentsWithClass()`

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

查找渲染树中组件的所有DOM元素，找到 类名 与 `className` 相匹配的DOM组件。

* * *

### `findRenderedDOMComponentWithClass()`

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

和 [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) 类似，但是期望只匹有一个结果并且返回该结果，如果匹配的结果数量不等于一，则会抛出异常。

* * *

### `scryRenderedDOMComponentsWithTag()`

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

查找渲染树中组件的所有DOM元素，找到 标签名 与 `tagName` 相匹配的DOM组件。

* * *

### `findRenderedDOMComponentWithTag()`

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

和 [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) 类似，但是期望只匹有一个结果并且返回该结果，如果匹配的结果数量不等于一，则会抛出异常。

* * *

### `scryRenderedComponentsWithType()`

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

找到所有 实例的类型为 `componentClass` 的 组件。

* * *

### `findRenderedComponentWithType()`

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

和 [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) 类似，但是期望只匹有一个结果并且返回该结果，如果匹配的结果数量不等于一，则会抛出异常。

* * *
