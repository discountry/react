---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

如果你用一个`<script>`标签导入React, 所有的顶层API都能在`ReactDOM`的全局范围内被调用。 如果你用的是npm和ES6，你可以用`import ReactDOM from 'react-dom'`。如果是npm和ES5，你可以用`var ReactDOM = require('react-dom')`。

## 总览

`react-dom`这个软件包提供了针对DOM的方法，可以在你应用的顶层调用，也可以在有需要的情况下用作到React模型外面的逃生出口。你的大部分组件都不应该需要使用这个包。

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### 浏览器支持

React支持所有常用的浏览器，包括IE9及以上的版本，although [some polyfills are required](/docs/javascript-environment-requirements.html) for older browsers such as IE 9 and IE 10.

> 注意
>
> 我们不支持那些不兼容ES5方法的老版浏览器，但如果你的应用包含了polyfill，例如[es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim)，你可能会发现你的应用仍然可以在这些浏览器中正常运行。如果你选择这么干，你就只能孤军奋战了。

* * *

## 参考

### `render()`

```javascript
ReactDOM.render(element, container[, callback])
```

渲染一个React元素成为DOM，放到所提供的`container`里。并且返回这个组件的一个 [引用](/docs/more-about-refs.html) (或者对于[无状态组件](/docs/components-and-props.html#functional-and-class-components)返回`null`)。

如果这个React元素在前一次已经被渲染成`container`，这将会为其执行一次更新，并且只会按需改变DOM，以反射最新的React元素。

如果可选的回调函数被提供，回调将在组件被渲染或更新之后执行。

> 注意:
>
> `ReactDOM.render()` 控制你传进容器节点里的内容。当第一次被调用时，内部存在的任何DOM元素都会被替换掉。之后的调用会使用React的DOM差分算法进行高效的更新。
>
> `ReactDOM.render()`不会修改容器节点（只修改容器的子代们）。你可以在不覆盖已有子节点的情况下添加一个组件到已有的DOM节点中去。
>
> `ReactDOM.render()` 目前会返回一个引用， 指向 `ReactComponent`的根实例。但是这个返回值是历史遗留的，应该避免使用。因为未来版本的React可能会在某些情况下进行异步渲染。如果你真的需要一个指向 `ReactComponent` 的根实例的引用，推荐的方法是添加一个 [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute)到根元素上。
>
> Using `ReactDOM.render()` to hydrate a server-rendered container is deprecated and will be removed in React 17. Use [`hydrate()`](#hydrate) instead.

* * *

### `hydrate()`

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.

React expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, React warns about mismatches during hydration. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because in most apps, mismatches are rare, and so validating all markup would be prohibitively expensive.

If a single element's attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the warning by adding `suppressHydrationWarning={true}` to the element. It only works one level deep, and is intended to be an escape hatch. Don't overuse it. Unless it's text content, React still won't attempt to patch it up, so it may remain inconsistent until future updates.

If you intentionally need to render something different on the server and the client, you can do a two-pass rendering. Components that render something different on the client can read a state variable like `this.state.isClient`, which you can set to `true` in `componentDidMount()`. This way the initial render pass will render the same content as the server, avoiding mismatches, but an additional pass will happen synchronously right after hydration. Note that this approach will make your components slower because they have to render twice, so use it with caution.

Remember to be mindful of user experience on slow connections. The JavaScript code may load significantly later than the initial HTML render, so if you render something different in the client-only pass, the transition can be jarring. However, if executed well, it may be beneficial to render a "shell" of the application on the server, and only show some of the extra widgets on the client. To learn how to do this without getting the markup mismatch issues, refer to the explanation in the previous paragraph.

* * *

### `unmountComponentAtNode()`

```javascript
ReactDOM.unmountComponentAtNode(container)
```

从DOM元素中移除已挂载的React组件，清除它的事件处理器和state。如果容器内没有挂载任何组件，这个函数什么都不会干。
有组件被卸载的时候返回`true`，没有组件可供卸载时返回 `false`。

* * *

### `findDOMNode()`

```javascript
ReactDOM.findDOMNode(component)
```
如果这个组件已经被挂载到DOM中，函数会返回对应的浏览器中生成的DOM元素 。
当你需要从DOM中读取值时，比如表单的值，或者计算DOM元素的尺寸，这个函数会非常有用。
 **大多数情况下，你可以添加一个指向DOM节点的引用，从而完全避免使用`findDOMNode` 这个函数.** 当 `render` 返回 `null` 或者 `false` 时, `findDOMNode` 也返回 `null`.

> 注意:
>
> `findDOMNode` 是用于操作底层DOM节点的备用方案。在大部分情况下都不提倡使用这个方案，因为它破坏了组件的抽象化。
>
> `findDOMNode` 只对挂载过的组件有效（也就是已经添加到DOM中去的组件）。如果你试图对一个未挂载的组件调用这个函数
（比如在一个还未创建的组件的 `render()` 函数中中调用 `findDOMNode()`），程序会抛出一个异常。
>
> `findDOMNode` 不能用于函数式的组件中。

* * *

### `createPortal()`

```javascript
ReactDOM.createPortal(child, container)
```

Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).