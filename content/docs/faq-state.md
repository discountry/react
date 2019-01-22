---
id: faq-state
title: 组件状态
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### setState 做了什么？

`setState()` 用于安排一个组件的 `state` 对象的一次更新的时间表。当状态改变时，组件通过重新渲染来响应。

### state 和 props 之间有什么区别？

属性[`props`](/docs/components-and-props.html) （“properties”的缩写）和 [`state`](/docs/state-and-lifecycle.html) 都是普通的JavaScript 对象。两者都具有影响渲染输出的信息。它们在一个重要方面是不同的： `props` 传递*到*组件（类似于函数的参数），而 `state` 是在组件*内部*管理的（类似于函数中声明的变量）。

这里有一些很好的资源，用以进一步了解何时使用 `props` vs `state` ：

* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](http://lucybain.com/blog/2016/react-state-vs-pros/)

### 为什么 `setState` 给我了错误值？

在React中，`this.props`和`this.state`代表*被渲染的*值，即，目前屏幕上的东西。

`setState` 的调用是异步的——不要紧接在调用 `setState` 之后，依赖 `this.state` 来反射新值。如果你需要基于当前状态计算值，则传递一个更新函数而不是一个对象（请参阅下面的详细信息）。

代码将*不*会按预期方式运行的示例：

```jsx
incrementCount() {
  // Note: this will *not* work as intended.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Let's say `this.state.count` starts at 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // When React re-renders the component, `this.state.count` will be 1, but you expected 3.

  // This is because `incrementCount()` function above reads from `this.state.count`,
  // but React doesn't update `this.state.count` until the component is re-rendered.
  // So `incrementCount()` ends up reading `this.state.count` as 0 every time, and sets it to 1.

  // The fix is described below!
}
```

接着看如何解决这个问题。

### 如何用依赖于当前状态的值更新状态？

传递一个函数而不是一个对象给 `setState` 来确保调用总是使用最新的状态（接着往下看）。

### 在 setState 中传递一个对象与一个函数之间有什么区别？

传递一个更新函数允许你在更新器中访问当前的状态值。由于 `setState` 调用是批处理的，这允许你链式更新并确保它们一个建立在另一个之上，而不是产生冲突：

```jsx
incrementCount() {
  this.setState((state) => {
    // Important: read `state` instead of `this.state` when updating.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Let's say `this.state.count` starts at 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // If you read `this.state.count` now, it would still be 0.
  // But when React re-renders the component, it will be 3.
}
```

[了解有关 setState 的更多](/docs/react-component.html#setstate)

### 何时`setState`是异步的?

目前，位于事件处理器中的`setState`是异步的。

这确保，例如，如果`Parent`和`Child`都调用`setState`在一次点击事件中，`Child`不会被重新渲染两次。而是，React "刷洗"状态更新在浏览器事件的结束时。这导致重大性能促进在更大应用中。

这是一个实现细节，所以避免直接依赖它。在将来的版本中，React 将在更多情况下默认批处理更新。

### 为什么React不是同步地更新`this.state`?

如前所述，React故意"等待"直到所有的组件都调用`setState()`在他们的事件处理器中才开始重新渲染。这提升了性能，避免了不必要的重新渲染。

然而，你可能仍奇怪为什么React不先只是更新`this.state`，不重新渲染。

有两个主要原因：

* 这将破坏`props`和`state`之间的一致性，引起问题，非常难以调试。
* 这将使一些我们正一起工作的新特征不可能实现。

This [GitHub comment](https://github.com/facebook/react/issues/11527#issuecomment-360199710) dives deep into the specific examples.

### 我是否应该使用一个像 Redux 或者 Mobx 的状态管理库？

[也许。](http://redux.js.org/docs/faq/General.html#general-when-to-use)

在添加额外的库之前，首先了解 React 是个好主意。你可以只使用 React 来构建相当复杂的应用程序。
