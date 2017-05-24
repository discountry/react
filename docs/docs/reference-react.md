---
id: react-api
title: React 高阶 API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
  - "docs/glossary.html"
---

`react` 是React库的入口点。如果你通过 `<script>` 标签加载React，这些高阶API可用于 `React` 全局。如果你使用ES6，你可以使用 `import React from 'react'` 。如果你使用ES5，你可以使用 `var React = require('react')` 。

## 概览

### Components

React 组件可以让你把UI分割为独立、可复用的片段，并将每一片段视为相互独立的部分。React组件可以通过继承 `React.Component` 或 `React.PureComponent` 来定义。

 - [`React.Component`](#react.component)
 - [`React.PureComponent`](#react.purecomponent)

如果不用ES6类，你可以使用 `create-react-class` 模块。参阅 [Using React without JSX](/react/docs/react-without-es6.html) 了解更多信息。

### Creating React Elements

推荐 [使用JSX](/react/docs/introducing-jsx.html) 描述你的UI外观。每个JSX元素仅是调用 [`React.createElement`](#createelement) 的语法糖。如果使用了JSX，你通常不会直接调用以下方法。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

参阅 [Using React without JSX](/react/docs/react-without-jsx.html) 了解更多。

### Transforming Elements

`React` 同时也提供了其他API：

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#react.children)

* * *

## Reference

### `React.Component`

用 [ES6 类](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 定义时，`React.Component`是React组件的基类。

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

有关 `React.Component` 的方法和属性列表，请参阅 [`React.Component API Reference`](/react/docs/react-component.html)。

* * *

### `React.PureComponent`

`React.PureComponent` 与 [`React.Component`](#react.component) 几乎完全相同，但 `React.PureComponent` 通过prop和state的浅对比来实现 [`shouldComponentUpate()`](/react/docs/react-component.html#shouldcomponentupdate)。

如果React组件的 `render()` 函数在给定相同的props和state下渲染为相同的结果，在某些场景下你可以使用 `React.PureComponent` 来提升性能。

> Note

> `React.PureComponent` 的 `shouldComponentUpdate()` 只会对对象进行浅对比。如果对象包含复杂的数据结构，它可能会因深层的数据不一致而产生错误的否定判断(表现为对象深层的数据已改变视图却没有更新, 原文：false-negatives)。当你期望只拥有简单的props和state时，才去继承 `PureComponent` ，或者在你知道深层的数据结构已经发生改变时使用 [`forceUpate()`](/react/docs/react-component.html#forceupdate) 。或者，考虑使用 [不可变对象](https://facebook.github.io/immutable-js/) 来促进嵌套数据的快速比较。
>
> 此外,`React.PureComponent` 的 `shouldComponentUpate()` 会忽略整个组件的子级。请确保所有的子级组件也是"Pure"的。

* * *

### `createElement()`

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

根据给定的类型创建并返回新的 [`React element`](/react/docs/rendering-elements.html) 。参数type既可以是一个html标签名称字符串(例如`'div'` 或 `'span'` )，也可以是一个 [`React component`](/react/docs/components-and-props.html) 类型(一个类或一个函数)。

`React.DOM` 提供了DOM组件的 `React.createElement()` 的便捷包装。举个例子，`React.DOM.a(...)` 是 `React.createELement('a', ...)` 的一个便捷包装。这个用法被认为是过时的，我们推荐您使用JSX，或者直接使用 `React.createElement()` 。

用 [`JSX`](/react/docs/introducing-jsx.html) 编写的代码会被转换成用 `React.createElement()` 实现。如果使用了JSX，你通常不会直接调用 `React.createElement()` 。参阅 [`React Without JSX`](/react/docs/react-without-jsx.html) 了解更多。

* * *

### `cloneElement()`

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

以 `element` 作为起点，克隆并返回一个新的React元素(React Element)。生成的元素将会拥有原始元素props与新props的浅合并。新的子级会替换现有的子级。来自原始元素的 `key` 和 `ref` 将会保留。

`React.cloneElement()` 几乎相当于：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

然而，它也保留了 `ref`。这意味着，如果你通过 `ref` 获取到子级组件时，不会一不小心从祖先组件里窃取了它。你将获得与你新元素相同的 `ref` 。

这个API是一个替换已弃用的 `React.addons.cloneWithProps()` 的方案。

* * *

### `createFactory()`

```javascript
React.createFactory(type)
```

根据给定的类型返回一个创建React元素的函数。类似 [`React.createElement`](#createElement) ，参数type既可以一个html标签名称字符串，也可以是一个 [`React component`](/react/docs/components-and-props.html) 类型(一个类或时一个函数)。

这个方法过时了，我们推荐你使用JSX或直接使用 `React.createElement()` 来替代它。

如果使用了JSX，你通常不会直接调用 `React.createFactory()` 。参阅 [`React Without JSX`](/react/docs/react-without-jsx.html)了解更多 。

* * *

### `isValidElement()`

```javascript
React.isValidElement(object)
```

验证对象是否是一个React元素。返回 `true` 或 `false` 。

* * *

### `React.Children`

`React.Children` 提供了处理 `this.props.children` 这个不透明数据结构的工具。

#### `React.Children.map`

```javascript
React.Children.map(children, function[(thisArg)])
```

在包含在 `children` 里的每个子级上调用函数，调用的函数的 `this` 设置为 `thisArg` 。如果 `children` 是一个嵌套的对象或数组，它将被遍历。如果 `children` 是 `null` 或 `undefined` ，返回 `null` 或 `undefined` 而不是一个空数组。

#### `React.Children.forEach`

```javascript
React.Children.forEach(children, function[(thisArg)])
```

类似 [`React.Children.map()`](#react.children.map) ，但是不返回数组。

#### `React.Children.count`

```javascript
React.Children.count(children)
```

返回 `children` 中的组件总数，相等于传给 `map` 或 `forEach` 时，回调函数被调用次数。

#### `React.Children.only`

```javascript
React.Children.only(children)
```

返回`children`里仅有的子级。否则抛出异常。

#### `React.Children.toArray`

```javascript
React.Children.toArray(children)
```

返回以赋key给每个子级 `child` 的扁平数组形式来组成不透明的 `children` 数据结构。如果你打算在你的渲染方法里操纵子级集合这很有用，特别是你想在 `this.props.children` 传下之前对它重新排序或切割。

> Note:
>
> 当children是扁平列表时，`React.Children.toArray()` 改变key来保留嵌套数组的语义。也就是说，为了在展开时保留嵌套数组的语义，`toArray` 会自动的给数组中每个 key 加了上前缀，以便将每个元素的key被限定到包含它的输入数组。
