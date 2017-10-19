---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

如果你用一个`<script>`标签导入React, 所有的顶阶的API都能在`ReactDOM`的全局范围内被调用。 如果你用的是
npm搭配ES6标准，你可以用`import ReactDOM from 'react-dom'`。如果是npm和ES5，你可以用`var ReactDOM = require('react-dom')`。

## 总览
`react-dom`这个软件包提供了针对DOM的方法，可以在你应用的顶级域中调用，也可以在有需要的情况下用作跳出React模型的出口。你的大部分组件都不应该需要使用这个包。

- [`render()`](#render)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)

### 浏览器兼容

React兼容所有常用的浏览器，包括IE9及以上的版本。

> 注意
>
> 我们不支持那些不兼容ES5方法的老版浏览器，但如果你的应用包含了polyfill，例如[es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim)，你可能会发现你的应用仍然可以在这些浏览器中正常运行。如果你选择这么干，你就只能孤军奋战了。

* * *

## 参考

### `render()`

```javascript
ReactDOM.render(
  element,
  container,
  [callback]
)
```

渲染一个React元素，添加到位于提供的`container`里的DOM元素中，并返回这个组件的一个 [引用](/docs/more-about-refs.html) (或者对于[无状态组件](/docs/components-and-props.html#functional-and-class-components)返回`null`).

如果这个React元素之前已经被渲染到`container`里去了，这段代码就会进行一次更新，并且只会改变那些反映元素最新状态所必须的DOM元素。

回调函数是可选的。如果你提供了，程序会在渲染或更新之后执行这个函数。

> 注意:
>
> `ReactDOM.render()` 控制你传进来的容器节点里的的内容。第一次被调用时，内部所有已经存在的DOM元素都会被替换掉。之后的调用会使用React的DOM比较算法进行高效的更新。
>
> `ReactDOM.render()`不会修改容器节点（只修改容器的子项）。你可以在不覆盖已有子节点的情况下添加一个组件到已有的DOM节点中去。
>
> `ReactDOM.render()` 目前会返回一个引用， 指向 `ReactComponent`的根实例。但是这个返回值是历史遗留，应该避免使用。因为未来版本的React可能会在某些情况下进行异步渲染。如果你真的需要一个指向 `ReactComponent` 的根实例的引用，推荐的方法是添加一个 [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute)到根元素上。

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
