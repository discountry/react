---
id: strict-mode
title: Strict Mode
permalink: docs/strict-mode.html
---

## 严格模式
`StrictMode`是一个用以标记出应用中潜在问题的工具。就像`Fragment`，`StrictMode`不会渲染任何真实的UI。它为其后代元素触发额外的检查和警告。

> 注意:
> 严格模式检查只在开发模式下运行，不会与生产模式冲突。

你可以在应用的任何地方启用严格模式。例如：

```js
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

在上面的例子中，不会对组件`Header`、`Footer`进行strict mode检查。然而`ComponentOne`、`ComponentTwo`以及它们所有的后代将被检查。

`StrictMode`目前有助于：
- [识别具有不安全生命周期的组件](#识别具有不安全生命周期的组件)
- [有关旧式字符串ref用法的警告](#有关旧式字符串ref用法的警告)
- [检测意外的副作用](#检测意外的副作用)

### 识别具有不安全生命周期的组件
如同在[博客](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)中阐明的，在异步React应用中使用某些老式的生命周期方法不安全。但是, 如果应用程序使用第三方库, 则很难确保不使用这些生命周期方法。幸运的是, 严格的模式可以帮助解决这个问题!

当启用严格模式, React将编译一个所有使用不安全生命周期组件的列表，并打印一条关于这些组件的警告信息，就像：

![](https://reactjs.org/static/strict-mode-unsafe-lifecycles-warning-e4fdbff774b356881123e69ad88eda88-2535d.png)

### 有关旧式字符串ref用法的警告
以前，React提供了2种方法管理ref：旧式的字符串ref API和回调API。虽然字符串ref API更加方便，但它有些许[缺点](https://github.com/facebook/react/issues/1373)，因此我们的正式建议是[改用回调方式](https://doc.react-china.org/docs/refs-and-the-dom.html#%E6%97%A7%E7%89%88-api%EF%BC%9Astring-%E7%B1%BB%E5%9E%8B%E7%9A%84-refs)

React 16.3新增了第三种方式, 它提供了字符串 ref 的方便性, 而没有任何缺点:
```JS
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```
由于新增的对象式refs很大程度上作为字符串ref的替换，因此strict mode现在对字符串ref的用法发出警告。

> 注意：
> 除了新的createRef API，回调ref将被继续支持。您不需要在组件中替换回调ref。它们稍微灵活一些, 因此它们将保持为高级功能。

[学习更多有关createRef API内容](https://doc.react-china.org/docs/refs-and-the-dom.html)

### 检测意外的副作用
理论上，React在两个阶段起作用:
- **渲染**阶段决定了需要对 DOM 进行哪些更改。在此阶段, React调用`render`(方法), 然后将结果与上一次渲染进行比较。
- **提交**阶段是React执行任何更改的阶段。(在React DOM中, 指React插入、更新和删除 dom 节点）。在此阶段React也调用生命周期, 如 `componentDidMount` 和 `componentDidUpdate` 。

提交阶段通常很快，但是渲染可能很慢。因此, 即将出现的异步模式 (默认情况下尚未启用) 将呈现工作分解为片断, 暂停和恢复工作以避免阻止浏览器。这意味着在提交之前, 反应可能不止一次地调用渲染阶段生命周期, 或者它可以在不提交的情况下调用它们 (因为错误或更高的优先级中断)。

渲染阶段的生命周期包括以下class component方法：
- `constructor`
- `componentWillMount`
- `componentWillReceiveProps`
- `componentWillUpdate`
- `getDerivedStateFromProps`
- `shouldComponentUpdate`
-  `render`
-  `setState` 更新函数 (第一个形参）

因为以上方法可能不止一次被调用，所以它们中不包含副作用尤为重要。忽略此规则可能会导致各种问题, 包括内存泄漏和无效的应用程序状态。不幸的是, 很难发现这些问题, 因为它们通常都是[不确定的](https://en.wikipedia.org/wiki/Deterministic_algorithm)。

严格模式不能自动检测到你的副作用, 但它可以帮助你发现它们, 使其更具确定性。这是通过有意地双调用以下方法来完成的:

- Class component `constructor`
- `render`
- `setState` 更新函数 (第一个形参）
-  static `getDerivedStateFromProps`

> 注意：
> 只在开发模式生效。生产模式下生命周期不会被双调用。

举个例子，考虑以下代码：

```JS
class TopLevelRoute extends React.Component {
  constructor(props) {
    super(props);

    SharedApplicationState.recordEvent('ExampleComponent');
  }
}
```
乍一看, 这段代码似乎没有问题。但是如果 `SharedApplicationState.recordEvent` 不是[幂等](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), 那么多次实例化此组件可能会导致无效的应用程序状态。这种微妙的 bug 可能不会在开发过程中显现出来, 或者它可能会不一致, 因此被忽略。

通过有意的双调用方法 (如组件构造函数), 严格模式使得这样的行为更容易被发现。