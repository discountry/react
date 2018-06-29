---
id: faq-state
title: 组件状态
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### setState 做了什么？

`setState()` 用于安排一个组件的 `state` 对象的一次更新。当状态改变时，组件通过重新渲染来响应。

### state 和 props 之间有什么区别？

[`props`](/docs/components-and-props.html) （简称“属性”）和 [`state`](/docs/state-and-lifecycle.html) 都是在改变时会触发一次重新渲染的 JavaScript 对象。虽然两者都具有影响渲染输出的信息，但它们在一个重要方面是不同的： `props` 传递到组件（类似于函数参数），而 `state` 是在组件内管理的（类似于函数中声明的变量）。

这里有一些很好的资源，用以进一步了解何时使用 `props` vs `state` ：

* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](http://lucybain.com/blog/2016/react-state-vs-pros/)

### 为什么 `setState` 给我传递了错误值？

`setState` 的调用是异步的 - 在调用 `setState` 之后，不要依赖 `this.state` 来立即反映新值。如果你需要基于当前状态的计算值（请参阅下面的详细信息），则传递更新函数而不是对象。

代码将不会按预期方式运行的示例：

```jsx
incrementCount() {
  // 注意：这将*不*按照预期工作。
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // this.state.count 是 1，然后我们这样做：
  this.incrementCount();
  this.incrementCount(); // 状态还没有更新，所以这里是将它设置为 2 而不是 3
}
```

接着看如何解决这个问题。

### 如何用依赖于当前状态的值更新状态？

传递一个函数而不是对象给 setState 来确保调用总是使用最新的状态（接着往下看）。

### 在 setState 中传递一个对象或者一个函数有什么区别？

传递一个更新函数允许你在更新中访问当前的状态值。由于 `setState` 调用是批处理的,这允许你链式更新并确保它们建立在彼此之上，而不是产生冲突：

```jsx
incrementCount() {
  this.setState((prevState) => {
    return {count: prevState.count + 1}
  });
}

handleSomething() {
  // this.state.count 是 1，然后我们这样做：
  this.incrementCount();
  this.incrementCount(); // count 现在是 3
}
```

[了解有关 setState 的更多](/docs/react-component.html#setstate)

### 我是否应该使用一个像 Redux 或者 Mobx 的状态管理库？

[也许。](http://redux.js.org/docs/faq/General.html#general-when-to-use)

在添加额外的库之前，首先了解 React 是个好主意。你可以只使用 React 来构建相当复杂的应用程序。
