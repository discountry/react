---
id: strict-mode
title: Strict Mode
permalink: docs/strict-mode.html
---

`StrictMode` 组件是用于在应用中帮助定位潜在问题的。类似于 `Fragment` 组件，`StrictMode` 组件不会渲染任何可视化的 UI。其会对子组件进行额外的检查和警告。

> 注意：
>
> 严格模式仅在开发模式下进行检查；_他们并不影响生产版本_。

你可以在应用的任何地方使用严格模式。例如：

```javascript
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

之前例子，严格模式并不会减产 `Header` 和 `Footer` 组件。然而，`ComponentOne` 和 `ComponentTwo`，及它们的子组件，将会被检查。

`严格模式` 组件目前会帮助：
* [识别组件中的不安全的生命周期方法](#identifying-uunsafe-lifecycles)
* [对于废弃的字符串 ref API 用法发出警告](#warning-about-legacy-string-ref-api-usage)
* [检测意外的副作用](#detecting-unexpected-side-effects)

其他功能将会在未来的 React 版本中添加。

### 识别不安全的生命周期

如之前[在这篇博文](/blog/2018/03/27/update-on-async-rendering.html)所阐述的，确定废弃的声明周期方法在异步的 React 应用中并不安全。然而，如果你的应用使用第三方的库，其很难确保这些声明周期未被使用。幸运地是，严格模式能够起到作用！

当使用严格模式时，React 会使用不安全的生命周期对所有的类组件进行编译，并对这些组件输出警告信息，类似于：

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

_现在_ 通过严格模式来处理这些问题会使得在之后发布的 React 版本中能够更好利用异步渲染。

### 对遗留的字符串 ref API 用法发出警告

之前，React 提供两种方式来管理 ref：字符串 ref 和回调函数。尽管字符串方式在这两种方法中会更方便，其仍然有[一些缺点](https://github.com/facebook/react/issues/1373)，因此官方推荐[使用回调函数的方式](/docs/refs-and-the-dom.html#legacy-api-string-refs)。

React 16.3 中提供了和字符串 ref 一样便利却没有任何副作用的第三种选择：

```javascript
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

由于 ref 对象被大量地用来替换 ref 字符串，现在严格模式会对字符串 ref 的用法进行警告。

> *注意：**
>
> 除了新的 `createRef` API 外，回调函数的 ref 也将会继续支持。
>
> 你不需要替换组件中的回调函数 ref。他们更灵活，因此它们将会作为高级特性而保留。

[在这里了解更过关于新 `createRef` API 信息。](/docs/refs-and-the-dom.html)

### 检测意外的副作用

概念上，React 会在下面两个阶段进行检测：
* **渲染**阶段决定哪些改变需要处理，如 DOM。在这一阶段，React 调用 `render` 方法并对返回结果和之前的返回结果进行比较。
* **提交（commit）** 阶段是当 React 处理变更时。（在 React DOM 的情况下，是当 React 在插入、更新和移除 DOM 节点。）React 在这一阶段也会调用如 `componentDidMount` 和 `componentDidUpdate` 的生命周期方法。

提交阶段通常非常快，但渲染则会比较慢。出于这一原因，在即将到来的异步模式（目前默认仍不支持）会阻断渲染，暂停和重新渲染来避免阻断浏览器。这意味着 React 可能在提交阶段前会多次调用渲染阶段的生命周期方法，或其可能会它们而完全不提交（因为错误或更高优先级的任务中断）。

渲染周期的声明周期方法包含下面的类组件方法：
* `constructor`
* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` 更新函数 (第一个参数)

因为之前的方法可能被多次调用，对于它们来说不包含副作用来说非常重要。忽视这一规则可能引发其他的问题，包括内存泄露和不合法的应用状态。不幸的是，这些问题很难检测，由于它们通常是[非确定性的](https://en.wikipedia.org/wiki/Deterministic_algorithm)。

严格模式并不会自动地检测副作用，但通过让它们变得稍微有确定性而能够帮助你定位。这是通过有意地重复调用以下方法来实现的：

* 类组件的 `constructor` 方法
* `render` 方法
* `setState` 更新函数（第一个参数）
* 类的静态生命周期方法 `getDreivedStateFromProps`

> 注意：
>
> 这仅在开发模式中生效。_在生产模式下生命周期并不会被两次调用。_

例如，考虑下面的代码：

```javascript
class TopLevelRoute extends React.Component {
  constructor(props) {
    super(props);

    SharedApplicationState.recordEvent('ExampleComponent');
  }
}
```

大略一看，上面的代码貌似没有问题。但如果 `SharedApplicationState.recordEvent` 不是[幂等](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning)，之后多次实例化该组件可能会导致不合理的应用状态。这类潜在的问题可能在开发期间可能并不明显，或其可能太不一致而被忽略。

通过有意地多次调用如组件的构造函数方法，严格模式使得这些问题更容易被定为。