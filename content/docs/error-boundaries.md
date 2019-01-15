---
id: error-boundaries
title: Error Boundaries
permalink: docs/error-boundaries.html
---

过去，组件内的 JavaScript 错误常常会破坏 React 内部状态并在下一次渲染时[产生](https://github.com/facebook/react/issues/4026) [加密的](https://github.com/facebook/react/issues/6895) [错误信息](https://github.com/facebook/react/issues/8579)。这些错误总会在应用代码的早期触发，但 React 并没有提供一种方式能够在组件内部优雅地来处理，也不能从错误中恢复。


## 错误边界介绍

部分 UI 的异常不应该破坏了整个应用。为了解决 React 用户的这一问题，React 16 引入了一种称为 “错误边界” 的新概念。

错误边界是**用于捕获其子组件树 JavaScript 异常，记录错误并展示一个回退的 UI** 的 React 组件，而不是整个组件树的异常。错误边界在渲染期间、生命周期方法内、以及整个组件树构造函数内捕获错误。

> **注意**
>
> 错误边界**无法**捕获如下错误:
> * 事件处理 （[了解更多](https://reactjs.org/docs/error-boundaries.html#how-about-event-handlers)）
> * 异步代码 （例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）
> * 服务端渲染
> * 错误边界自身抛出来的错误 （而不是其子组件）

一个类组件变成一个错误边界。如果它定义了生命周期方法 [`static getDerivedStateFromError()`](https://reactjs.org/docs/react-component.html#static-getderivedstatefromerror)或者[`componentDidCatch()`](https://reactjs.org/docs/react-component.html#componentdidcatch)中的任意一个或两个。当一个错误被扔出后，使用`static getDerivedStateFromError()`渲染一个退路UI。使用`componentDidCatch()`去记录错误信息。

```js{6-14,17-20}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
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

错误边界工作机制类似于JavaScript `catch {}`，只是应用于组件。仅有类组件可以成为错误边界。实践中，大多数时间，你希望定义一个错误边界组件一次并将它贯穿你的整个应用。

注意**错误边界仅可以捕获组件在树中比他低的组件的错误**。错误边界无法捕获其自身的错误。如果一个错误边界无法渲染错误信息，则错误会向上冒泡至最接近的错误边界。这也类似于 JavaScript 中 `catch {}` 的工作机制。

## 在线演示

检出[this example of declaring and using an error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) 使用[React 16](https://reactjs.org/blog/2017/09/26/react-v16.0.html).


## 错误边界放到哪里

错误边界的粒度是由你决定。你可以将其包装在最顶层的路由组件显示给用户"有东西出错"消息，就像服务端框架经常处理崩溃一样。你也可以将单独的插件包装在错误边界内以保护应用其他部分不崩溃。

## 未捕获错误的新行为

这个改变有一个重要的暗示。**从React 16起，任何未被错误边界捕获的错误将导致卸载整个 React 组件树。**

我们对这一决定饱含争论，但在我们的经验中放置下一个腐败的UI比完全移除它要更糟糕。例如，在类似 Messenger 的产品中留下一个异常的可见 UI 可能会导致用户将信息发错给别人。类似的，对于支付类的应用来说，什么都不展示也比显示一堆错误更好。

这一改变意味着随着你迁入到 React 16，你将可能会发现一些已存在你应用中但未曾注意到的崩溃。增加错误边界能够让你在发生异常时提供更好的用户体验。

例如，Facebook Messenger 将侧边栏、信息面板，对话框以及信息输入框包装在单独的错误边界中。如果其中的某些 UI 组件崩溃，其余部分仍然能够交互。

我们也鼓励使用 JS 错误报告服务（或自行构建）这样你能够掌握在生产环境中发生的未捕获的异常，并将其修复。


## 组件栈追踪

React 16 会将渲染期间所有在开发环境下的发生的错误打印到控制台，即使应用程序意外的将其掩盖。除了错误信息和 JavaScript 栈外，其还提供了组件栈追踪。现在你可以准确地查看发生在组件树内的错误信息：

<img src="https://raw.githubusercontent.com/discountry/react/master/content/images/docs/error-boundaries-stack-trace.png" alt="Error caught by Error Boundary component" />

你也可以在组件追踪堆栈中查看文件名和行号。这一功能在 [Create React App 项目](https://github.com/facebookincubator/create-react-app)中默认开启：

<img src="https://raw.githubusercontent.com/discountry/react/master/content/images/docs/error-boundaries-stack-trace-line-numbers.png" alt="Error caught by Error Boundary component with line numbers" />

若你不使用 Create React App，你可以手动添加该[插件](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source)到你的 Babel 配置中。注意其仅能在开发环境中使用并且**在生产环境中必须关闭**。

> 注意
>
> 组件名称在栈追踪中的显示依赖于[`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)属性。 If you support older browsers and devices which may not yet provide this natively (e.g. IE 11), consider including a `Function.name` polyfill in your bundled application, such as [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). 另一种方法, 你可以明确地在所有组件上设置[`displayName`](https://reactjs.org/docs/react-component.html#displayname)属性。

## 关于try/catch

`try` / `catch` 非常棒，但其仅能用在命令式代码下：

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

然而，React 组件是声明式的并且具体指出什么需要被渲染：

```js
<Button />
```

错误边界保留了 React 的声明式的本质，其行为符合你的预期。例如，即使错误发生在 `componentDidUpdate` 方法中，由树中深藏在某处的 `setState` 引起，其仍然能够传播到最近的错误边界。

## 关于事件处理器

错误边界**无法**捕获事件处理器内部的错误。

React 不需要错误边界恢复位于事件处理器内的错误。不像渲染方法或生命周期钩子，不同于render方法和生命周期方法，事件处理器不是在渲染时发生。因此若他们抛出异常，React 仍然能够知道需要在屏幕上显示什么。

如果你需要在事件处理器内部捕获错误，使用普通的 JavaScript `try` / `catch` 语句：

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
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

注意上述例子仅是说明普通的 JavaScript 行为而并未使用错误边界。

## 自 React 15 的名称变更

React 15 在一个不同的方法名下：`unstable_handleError` 包含了一个支持有限的错误边界。这一方法不再能用，同时自 React 16 beta 发布起你需要在代码中将其修改为 `componentDidCatch`。

为这一改变，我们已提供了一个 [codemod](https://github.com/reactjs/react-codemod#error-boundaries) 来帮助你自动迁移你的代码。

