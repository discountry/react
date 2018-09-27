---
id: rendering-elements
title: 元素渲染
permalink: docs/rendering-elements.html
redirect_from: "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

元素是构成 React 应用的最小单位。

元素用来描述你在屏幕上看到的内容：

```js
const element = <h1>Hello, world</h1>;
```

与浏览器的 DOM 元素不同，React 当中的元素事实上是普通的对象，React DOM 可以确保 浏览器 DOM 的数据内容与 React 元素保持一致。

>**注意:**
>
>初学者很可能把元素的定义和一个内涵更广的定义“组件”给搞混了。我们将会在[下一个章节](/docs/components-and-props.html)当中对组件进行详细的介绍。元素事实上只是构成组件的一个部分，所以我们还是推荐你先读完这一章节的内容再往后看。

## 将元素渲染到 DOM 中

首先我们在一个 HTML 页面中添加一个 `id="root"` 的 `<div>`:

```html
<div id="root"></div>
```

在此 div 中的所有内容都将由 React DOM 来管理，所以我们将其称之为 “根” DOM 节点。

我们用React 开发应用时一般只会定义一个根节点。但如果你是在一个已有的项目当中引入 React 的话，你可能会需要在不同的部分单独定义 React 根节点。

要将React元素渲染到根DOM节点中，我们通过把它们都传递给 `ReactDOM.render()` 的方法来将其渲染到页面上：

`embed:rendering-elements/render-an-element.js`

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/rrpgNB?editors=1010)

页面上会展示出 "Hello World" 字样。

## 更新元素渲染

React 元素都是[immutable 不可变](https://en.wikipedia.org/wiki/Immutable_object)的。当元素被创建之后，你是无法改变其内容或属性的。一个元素就好像是动画里的一帧，它代表应用界面在某一时间点的样子。

根据我们现阶段了解的有关 React 知识，更新界面的唯一办法是创建一个新的元素，然后将它传入 `ReactDOM.render()` 方法：

来看一下这个计时器的例子:

`embed:rendering-elements/update-rendered-element.js`

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

这个示例通过 [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) 方法，每秒钟调用一次 `ReactDOM.render()`.

>**注意:**
>
>在实际生产开发中，大多数React应用只会调用一次 `ReactDOM.render()` 。在下一个章节中我们将会详细介绍 [有状态组件](/docs/state-and-lifecycle.html) 实现 DOM 更新方式。
>
>前后的内容是相辅相成的，所以你最好还是先读完本章节再往下看。

## React 只会更新必要的部分

React DOM 首先会比较元素内容先后的不同，而在渲染过程中只会更新改变了的部分。

你可以使用浏览器的开发者工具来检查一下[之前的例子](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)。

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

即便我们每秒都创建了一个描述整个UI树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容。

根据我们以往的经验，将界面视为一个个特定时刻的固定内容（就像一帧一帧的动画），而不是随时处于变化之中（而不是处于变化中的一整段动画），将会有利于我们理清开发思路，减少各种bug。
