---
id: error-boundaries
title: Error Boundaries
permalink: docs/error-boundaries.html
---

过去，组件内的 JavaScript 错误常常会破坏 React 内部状态并在下一次渲染时[产生](https://github.com/facebook/react/issues/4026) [加密的](https://github.com/facebook/react/issues/6895) [错误信息](https://github.com/facebook/react/issues/8579)。这些错误总会在应用代码的早期触发，但 React 并没有提供一种方式能够在组件内部优雅地来处理，也不能从错误中恢复。


## 错误边界介绍

部分 UI 的异常不应该破坏了整个应用。为了解决 React 用户的这一问题，React 16 引入了一种称为 “错误边界” 的新概念。

错误边界是**用于捕获其子组件树 JavaScript 异常，记录错误并展示一个回退的 UI** 的 React 组件，而不是整个组件树的异常。错误组件在渲染期间，生命周期方法内，以及整个组件树构造函数内捕获错误。

> 注意

> 错误边界**无法**捕获如下错误:

> * 事件处理 （[了解更多](https://reactjs.org/docs/error-boundaries.html#how-about-event-handlers)）
> * 异步代码 （例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）
> * 服务端渲染
> * 错误边界自身抛出来的错误 （而不是其子组件）

如果一个类组件定义了一个名为 `componentDidCatch(error, info):` 的新方法，则其成为一个错误边界：

```js{7-12,15-18}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

而后你可以像一个普通的组件一样使用：

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

`componentDidCatch()` 方法机制类似于 JavaScript `catch {}`，但是针对组件。仅有类组件可以成为错误边界。实际上，大多数时间你仅想要定义一个错误边界组件并在你的整个应用中使用。

注意**错误边界仅可以捕获其子组件的错误**。错误边界无法捕获其自身的错误。如果一个错误边界无法渲染错误信息，则错误会向上冒泡至最接近的错误边界。这也类似于 JavaScript 中 catch {} 的工作机制。

### componentDidCatch 参数

`error` 是被抛出的错误。

`info` 是一个含有 `componentStack` 属性的对象。这一属性包含了错误期间关于组件的堆栈信息。

```js
//...
componentDidCatch(error, info) {
  
  /* Example stack information:
     in ComponentThatThrows (created by App)
     in ErrorBoundary (created by App)
     in div (created by App)
     in App
  */
  logComponentStackToMyService(info.componentStack);
}

//...
```

## 在线演示

查看通过 [React 16 beta 版本](https://github.com/facebook/react/issues/10294)来[定义和使用错误边界的例子](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)。


## 如何放置错误边界

错误边界的粒度完全取决于你的应用。你可以将其包装在最顶层的路由组件并为用户展示一个 "发生异常（Something went wrong）"的错误信息，就像服务端框架通常处理崩溃一样。你也可以将单独的插件包装在错误边界内部以保护应用不受该组件崩溃的影响。

## 未捕获错误（Uncaught Errors）的新行为

这一改变有非常重要的意义。**自 React 16 开始，任何未被错误边界捕获的错误将会卸载整个 React 组件树。**

我们对这一决定饱含争论，但在我们的经验中放置下一个错误的UI比完全移除它要更糟糕。例如，在类似 Messenger 的产品中留下一个异常的可见 UI 可能会导致用户将信息发错给别人。类似的，对于支付类的应用来说，什么都不展示也比显示一堆错误更好。

这一改变意味着随着你迁入到 React 16，你将可能会发现一些已存在你应用中但未曾注意到的崩溃。增加错误边界能够让你在发生异常时提供更好的用户体验。

例如，Facebook Messenger 将侧边栏、信息面板，对话框以及信息输入框包装在单独的错误边界中。如果其中的某些 UI 组件崩溃，其余部分仍然能够交互。

我们也鼓励使用 JS 错误报告服务（或自行构建）这样你能够掌握在生产环境中发生的未捕获的异常，并将其修复。


## 组件栈追踪

React 16 会将渲染期间所有在开发环境下的发生的错误打印到控制台，即使应用程序意外的将其掩盖。除了错误信息和 JavaScript 栈外，其还提供了组件栈追踪。现在你可以准确地查看发生在组件树内的错误信息：

<img src="https://raw.githubusercontent.com/discountry/react/master/content/images/docs/error-boundaries-stack-trace.png" alt="Error caught by Error Boundary component" />

你也可以在组件堆栈中查看文件名和行数。这一功能在 [Create React App 项目](https://github.com/facebookincubator/create-react-app)中默认开启：

<img src="https://raw.githubusercontent.com/discountry/react/master/content/images/docs/error-boundaries-stack-trace-line-numbers.png" alt="Error caught by Error Boundary component with line numbers" />

若你不使用 Create React App，你可以手动添加该[插件](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source)到你的 Babel 配置中。注意其仅能在开发环境中使用并**禁止在生产环境中使用**。


## 为何不使用 try/catch?

`try` / `catch` 非常棒，但其仅能在命令式代码（imperative code）下可用：

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

然而，React 组件是声明式的并且具体指出 *声明* 什么需要被渲染：

```js
<Button />
```

错误边界保留了 React 原生的声明性质，且其行为符合你的预期。例如，即使错误发生 `componentDidUpdate` 时期由某一个深层组件树中的 `setState` 调用引起，其仍然能够冒泡到最近的错误边界。

## 事件处理器如何处理？

错误边界无法捕获事件处理器内部的错误。

React 不需要错误边界在事件处理器内将其从错误中恢复。不像渲染方法或生命周期钩子，事件处理器不会再渲染周期内触发。因此若他们抛出异常，React 仍然能够知道需要在屏幕上显示什么。

如果你需要在事件处理器内部捕获错误，使用普通的 JavaScript try / catch 语句：

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  
  handleClick = () => {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <div onClick={this.handleClick}>Click Me</div>
  }
}
```

Note that the above example is demonstrating regular JavaScript behavior and doesn’t use error boundaries.

注意上述例子仅是说明普通的 JavaScript 行为而并未使用错误边界。

## 自 React 15 的名称变更

React 15 在一个不同的方法名下：`unstable_handleError` 包含了一个支持有限的错误边界。这一方法不再能用，同时自 React 16 beta 发布起你需要在代码中将其修改为 `componentDidCatch`。

为这一改变，我们已提供了一个 [codemod](https://github.com/reactjs/react-codemod#error-boundaries) 来帮助你自动迁移你的代码。
