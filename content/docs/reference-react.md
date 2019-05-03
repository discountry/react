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

`react` 是React库的入口点。如果你通过 `<script>` 标签加载React，这些顶层API可用于 `React` 全局。如果你使用ES6，你可以使用 `import React from 'react'`。如果你使用ES5，你可以使用 `var React = require('react')` 。

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

有关基类 `React.Component` 的方法和属性列表，请参阅 [`React.Component API Reference`](/docs/react-component.html)。

* * *

### `React.PureComponent`

`React.PureComponent` 类似于 [`React.Component`](#react.component)。它们的不同之处在于[`React.Component`](https://reactjs.org/docs/react-api.html#reactcomponent) 没有实现 [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)，但是 `React.PureComponent`实现了它。采用对属性和状态用浅比较的方式。

如果React组件的 `render()` 函数在给定相同的props和state下渲染为相同的结果，在某些场景下你可以使用 `React.PureComponent` 来提升性能。

> 注意
> 
> `React.PureComponent` 的 `shouldComponentUpdate()` 只会对对象进行浅对比。如果对象包含复杂的数据结构，它可能会因深层的数据不同而产生漏报判断。仅当你知道拥有的是简单的属性和状态时，才去继承 `PureComponent`，或者在你知道深层的数据结构已经发生改变时使用 [`forceUpate()`](/docs/react-component.html#forceupdate)。或者，考虑使用 [不可变对象](https://facebook.github.io/immutable-js/) 来促进嵌套数据的快速比较。
>
> 此外,`React.PureComponent` 的 `shouldComponentUpdate()` 会略过为整个组件的子树更新属性。请确保所有的子级组件也是"纯"的。

* * *

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

* * *

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

* * *

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

* * *

### `createFactory()`

```javascript
React.createFactory(type)
```

返回一个函数，此函数创建给定类型的React元素。类似 [`React.createElement`](#createElement)，类型参数既可以是一个标签名称字符串(such as `'div'` or `'span'`)，也可以是一个 [`React component`](/docs/components-and-props.html) 类型(一个类或一个函数)，或者一个[React fragment](https://reactjs.org/docs/react-api.html#reactfragment)类型。

这个方法被认为是遗留的，我们鼓励你使用JSX或直接使用 `React.createElement()` 来替代它。

如果使用了JSX，你通常不会直接调用`React.createFactory()` 。参阅 [`React Without JSX`](/docs/react-without-jsx.html)了解更多 。

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

在包含在 `children` 里的每个直接孩子上调用一个函数，并且`this` 设置为 `thisArg` 。如果 `children` 是一个数组它将被遍历，函数将被调用为每个数组中的孩子。如果 `children` 是 `null` 或 `undefined` ，这个方法将返回 `null` 或 `undefined` 而不是一个数组。

> 注意
>
> 如果 `children` 是一个 `Fragment`，它将被当作单独一个孩子，不会被遍历。

#### `React.Children.forEach`

```javascript
React.Children.forEach(children, function[(thisArg)])
```

类似 [`React.Children.map()`](#react.children.map) ，但是不返回数组。

#### `React.Children.count`

```javascript
React.Children.count(children)
```

返回 `children` 中的组件总数，等于传给 `map` 或 `forEach` 的回调函数被调用的次数。

#### `React.Children.only`

```javascript
React.Children.only(children)
```

验证`children`只有唯一一个孩子（React元素）并返回它。否则这个方法扔抛出一个错误。

> 注意
>
> `React.Children.only()` 不接受 the return value of [`React.Children.map()`](https://reactjs.org/docs/react-api.html#reactchildrenmap) 因为它是一个数组而不是一个React元素。

#### `React.Children.toArray`

```javascript
React.Children.toArray(children)
```

返回`children` 不透明的数据结构作为一个扁平数组，并将键赋给每个孩子。一个用途是当你打算在渲染方法里操纵子代集合时，特别是你想在 `this.props.children` 传下它之前对它重新排序或切片。

> 注意
>
> 当扁平化子代列表时，`React.Children.toArray()` 改变key来保留嵌套数组的语义。也就是说，`toArray` 会给被返回的数组中的每个键加上前缀。这样每个元素的键会应用作用域到它的输入数组。

* * *

### `React.Fragment`

`React.Fragment` 组件让你在一个`render()` 方法中返回多个元素，而不用创造一个额外的 DOM 元素：

```js
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

### `React.createRef`

`React.createRef` creates a [ref](/docs/refs-and-the-dom.html) that can be attached to React elements via the ref attribute.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef`

`React.forwardRef` creates a React component that forwards the [ref](/docs/refs-and-the-dom.html) attribute it receives to another component below in the tree. This technique is not very common but is particularly useful in two scenarios:

* [Forwarding refs to DOM components](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Forwarding refs in higher-order-components](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` accepts a rendering function as an argument. React will call this function with `props` and `ref` as two arguments. This function should return a React node.

`embed:reference-react-forward-ref.js`

In the above example, React passes a `ref` given to `<FancyButton ref={ref}>` element as a second argument to the rendering function inside the `React.forwardRef` call. This rendering function passes the `ref` to the `<button ref={ref}>` element.

As a result, after React attaches the ref, `ref.current` will point directly to the `<button>` DOM element instance.

For more information, see [forwarding refs](/docs/forwarding-refs.html).

### `React.lazy`

`React.lazy()` lets you define a component that is loaded dynamically. This helps reduce the bundle size to delay loading components that aren't used during the initial render.

You can learn how to use it from our [code splitting documentation](/docs/code-splitting.html#reactlazy). You might also want to check out [this article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) explaining how to use it in more detail.

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Note that rendering `lazy` components requires that there's a `<React.Suspense>` component higher in the rendering tree. This is how you specify a loading indicator.

> **Note**
>
> Using `React.lazy`with dynamic import requires Promises to be available in the JS environment. This requires a polyfill on IE11 and below.

### `React.Suspense`

`React.Suspense` let you specify the loading indicator in case some components in the tree below it are not yet ready to render. Today, lazy loading components is the **only** use case supported by `<React.Suspense>`:

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

It is documented in our [code splitting guide](/docs/code-splitting.html#reactlazy). Note that `lazy` components can be deep inside the `Suspense` tree -- it doesn't have to wrap every one of them. The best practice is to place `<Suspense>` where you want to see a loading indicator, but to use `lazy()` wherever you want to do code splitting.

While this is not supported today, in the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](/blog/2018/11/27/react-16-roadmap.html).

>Note:
>
>`React.lazy()` and `<React.Suspense>` are not yet supported by `ReactDOMServer`. This is a known limitation that will be resolved in the future.
