---
id: react-api
title: React 顶层 API
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
---

`react` 是React库的入口点。如果你通过 `<script>` 标签加载React，这些顶层API可用于 `React` 全局。如果你使用ES6，你可以使用 `import React from 'react'` 。如果你使用ES5，你可以使用 `var React = require('react')` 。

## 概览

### Components

React 组件可以让你把UI分割为独立、可复用的片段，并将每一片段视为相互独立的部分。React组件可以通过继承 `React.Component` 或 `React.PureComponent` 来定义。

 - [`React.Component`](#react.component)
 - [`React.PureComponent`](#react.purecomponent)

如果不用ES6类，你可以使用 `create-react-class` 模块。参阅 [Using React without JSX](/docs/react-without-es6.html) 了解更多信息。

React components can also be defined as functions which can be wrapped:

- [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo)

### Creating React Elements

推荐 [使用JSX](/docs/introducing-jsx.html) 描述你的UI外观。每个JSX元素仅是调用 [`React.createElement`](#createelement) 的语法糖。如果使用了JSX，你通常不会直接调用以下方法。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

参阅 [Using React without JSX](/docs/react-without-jsx.html) 了解更多。

### Transforming Elements

`React` 提供了几个API用于操纵元素：

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#react.children)

### Fragments

`React` also provides a component for rendering multiple elements without a wrapper.

- [`React.Fragment`](#reactfragment)

### Refs

- [`React.createRef`](https://reactjs.org/docs/react-api.html#reactcreateref)
- [`React.forwardRef`](https://reactjs.org/docs/react-api.html#reactforwardref)

### Suspense

Suspense lets components “wait” for something before rendering. Today, Suspense only supports one use case: [loading components dynamically with `React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy). In the future, it will support other use cases like data fetching.

- [`React.lazy`](https://reactjs.org/docs/react-api.html#reactlazy)
- [`React.Suspense`](https://reactjs.org/docs/react-api.html#reactsuspense)

------

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

有关基类 `React.Component` 的方法和属性列表，请参阅 [`React.Component API Reference`](/docs/react-component.html)。

------

### `React.PureComponent`

`React.PureComponent` 类似于 [`React.Component`](#react.component)。它们的不同之处在于[`React.Component`](https://reactjs.org/docs/react-api.html#reactcomponent) 没有实现 [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)，但是 `React.PureComponent`实现了它。采用对属性和状态用浅比较的方式。

如果React组件的 `render()` 函数在给定相同的props和state下渲染为相同的结果，在某些场景下你可以使用 `React.PureComponent` 来提升性能。

> 注意
> 
> `React.PureComponent` 的 `shouldComponentUpdate()` 只会对对象进行浅对比。如果对象包含复杂的数据结构，它可能会因深层的数据不同而产生漏报判断。仅当你知道拥有的是简单的属性和状态时，才去继承 `PureComponent`，或者在你知道深层的数据结构已经发生改变时使用 [`forceUpate()`](/docs/react-component.html#forceupdate)。或者，考虑使用 [不可变对象](https://facebook.github.io/immutable-js/) 来促进嵌套数据的快速比较。
>
> 此外,`React.PureComponent` 的 `shouldComponentUpdate()` 会略过为整个组件的子树更新属性。请确保所有的子级组件也是"纯"的。

------

### `React.memo`

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```

`React.memo` is a [higher order component](https://reactjs.org/docs/higher-order-components.html). It’s similar to [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) but for function components instead of classes.

If your function component renders the same result given the same props, you can wrap it in a call to `React.memo` for a performance boost in some cases by memoizing the result. This means that React will skip rendering the component, and reuse the last rendered result.

By default it will only shallowly compare complex objects in the props object. If you want control over the comparison, you can also provide a custom comparison function as the second argument.

```js
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
export default React.memo(MyComponent, areEqual);
```

This method only exists as a **performance optimization.** Do not rely on it to “prevent” a render, as this can lead to bugs.

> Note
>
> Unlike the [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) method on class components, the `areEqual` function returns `true` if the props are equal and `false` if the props are not equal. This is the inverse from `shouldComponentUpdate`.

------

### `createElement()`

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

创建并返回给定类型的新 [`React element`](/docs/rendering-elements.html) 。参数type既可以是一个标签名称字符串(例如`'div'` 或 `'span'` )，也可以是一个 [`React component`](/docs/components-and-props.html) 类型(一个类或一个函数)，或者一个[React fragment](https://reactjs.org/docs/react-api.html#reactfragment) 类型。

`React.DOM` 提供了DOM组件的 `React.createElement()` 的便捷包装。举个例子，`React.DOM.a(...)` 是 `React.createELement('a', ...)` 的一个便捷包装。这个用法被认为是过时的，我们推荐您使用JSX，或者直接使用 `React.createElement()` 。

用 [`JSX`](/docs/introducing-jsx.html) 编写的代码会被转换成用 `React.createElement()` 实现。如果使用了JSX，你通常不会直接调用 `React.createElement()`。参阅 [`React Without JSX`](/docs/react-without-jsx.html) 了解更多。

------

### `cloneElement()`

```js
React.cloneElement(
  element,
  [props],
  [...children]
)
```

克隆并返回一个新的React元素(React Element)，使用 `element` 作为起点。生成的元素将会拥有原始元素props与新props的浅合并。新的子级会替换现有的子级。来自原始元素的 `key` 和 `ref` 将会保留。

`React.cloneElement()` 几乎相当于：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

然而，它也保留了全部的 `ref`。这意味着，如果你通过 `ref` 获取到孩子时，不会偶然从祖先组件里窃取了它。你将获得同一个`ref`附着到你的新元素。

引入这个API用来替换已弃用的 `React.addons.cloneWithProps()`。

------

### `createFactory()`

```javascript
React.createFactory(type)
```

根据给定的类型返回一个创建React元素的函数。类似 [`React.createElement`](#createElement) ，参数type既可以一个html标签名称字符串，也可以是一个 [`React component`](/docs/components-and-props.html) 类型(一个类或时一个函数)。

这个方法过时了，我们推荐你使用JSX或直接使用 `React.createElement()` 来替代它。

如果使用了JSX，你通常不会直接调用 `React.createFactory()` 。参阅 [`React Without JSX`](/docs/react-without-jsx.html)了解更多 。

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

* * *

### `React.Fragment`

The `React.Fragment` component lets you return multiple elements in a `render()` method without creating an additional DOM element:

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

You can also use it with the shorthand `<></>` syntax. For more information, see [React v16.2.0: Improved Support for Fragments](/blog/2017/11/28/react-v16.2.0-fragment-support.html).

### `React.forwardRef`

`React.forwardRef` accepts a render function that receives `props` and `ref` parameters and returns a React node. Ref forwarding is a technique for passing a [ref](/docs/refs-and-the-dom.html) through a component to one of its descendants. This technique can be particularly useful with [higher-order components](/docs/higher-order-components.html):
`embed:reference-react-forward-ref.js`

For more information, see [forwarding refs](/docs/forwarding-refs.html).
