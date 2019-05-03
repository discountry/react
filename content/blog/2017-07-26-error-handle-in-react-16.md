---
title: "Error Handle in React 16"
author: [gaearon]
---

随着React 16发布在即，我们打算介绍一些在组件内部React如何处理JavaScript错误。这些改变包含在React 16的beta版本中，并将成为React 16的一部分。

**顺便一提，[你可以尝试我们刚发布了React 16的第一个测试版本！](https://github.com/facebook/react/issues/10294)**

## React 15及之前的行为

过去，组件内部的JavaScript异常曾经常阻断了React内部状态并导致其在下一次渲染时[触发了隐藏的错误](https://github.com/facebook/react/issues/6895)。这些错误常常是由应用程序代码中的早期错误所引起的，但React并未提供一种在组件里优雅处理的方式，也不会从异常中回复。

## 错误边界介绍

UI部分的JavaScript异常不应阻断整个应用。为了为React用户解决这一问题，React 16引入了“错误边界（error boundary”）”这一新概念。

错误边界作为React组件，用以**捕获在子组件树种任何地方的JavaScript异常，打印这些错误，并展示备用UI**而非让组件树崩溃。错误边界会捕获渲染期间，在生命周期方法中以及在其整个树的构造函数中的异常。

若定义一个称为`componentDidCatch(error, info)`的新生命周期方法，则类组件将成为错误边界：

```javascript
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

而后可作为一个正常组件进行使用：

```javascript
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

`componentDidCatch()`方法的作用类似于JavaScript的`catch {}`，但仅针对组件。仅有类组件可以成为错误边界。实际上，大多数时间你会想仅声明一次错误边界组件并在整个应用中使用。
 
注意，**错误边界仅可以捕获树中后代的组件错误**。一个错误边界无法捕获其自身的错误。若错误边界尝试渲染错误信息失败，则该错误会传递至上方最接近的错误边界。而这也类似JavaScript中的`catch {}`块的工作方式。

## Live Demo

查看[在React 16测试版](https://github.com/facebook/react/issues/10294)中[关于如何声明和使用错误边界的例子](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)。

## 放置错误边界

错误边界的粒度完全取决于你。你可能将其包装在顶层路由组件中并为用户展示“内部异常（Something went wrong）”的信息，类似于服务端框架处理崩溃。你可能也会在错误边界包装一些内部组件用以保护不会让应用的余下部分不会崩溃。

## 未捕获错误的新行为

这一改变有一个重要的意义。**作为React 16中不是由错误边界引起的错误将会使得整个React组件树被卸载。**

我们曾争论这一决定，但在我们的经验中，将损坏的UI留在那里要比完全移除它要糟糕得多。例如，在类似Messenger这样的产品中留下可见的损坏的UI可能会导致一些人将信息发送给错误的人。类似地，对于支付应用来说显示错误的金额要比什么都不显示糟糕得多。


这一改变意味着随着迁移至React 16，你们将会发现之前未留意过的应用程序存在的崩溃。增加错误边界能够让你在发生异常时提供更好的用户体验。

例如，Facebook Messenger将边栏，信息面板，会话日志以及消息输入的内容包装到单独的错误边界中。若其中某一个组件的UI崩溃了，其余的仍能正常交互。

我们也鼓励你使用JS错误报告服务（或自己构建）以让你能够了解在产品中产生的未处理的异常，并修复它们。

## 组件栈追踪

React 16会打印所有在开发环节中发生在渲染过程的错误到控制台，即使应用程序意外地将他们吞了。除了错误信息和JavaScript堆栈，其还提供了组件栈追踪。闲杂你可以在组件树中精确地查看错误产生的地方：

<img src="/react/img/blog/error-boundaries-stack-trace.png" alt="Component stack traces in error message" />

你也可以在组件堆栈中查看文件名和行数。这一功能在[Create React App 项目](https://github.com/facebookincubator/create-react-app)中默认开启：

<img
src="/react/img/blog/error-boundaries-stack-trace-line-numbers.png" alt="Component stack traces with line numbers in error message" />

若你不使用Create React App，你可以手动添加[该插件](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) 到你的Babel配置中。注意其仅能在开发环境中使用并**禁止在生产环境中使用。**

## 为何不使用`try` / `catch`？

`try` / `catch` 很好但其仅适用于命令式的代码：

```javascript
try {
  showButton();
} catch (error) {
  // ...
}
```

然而，React组件是声明式的，并指定了什么应该被渲染：

```javascript
<Button />
```

错误边界保留了React声明式的特性，同时其行为和你期望的一直。例如，即使一个在`componentDidUpdate`周期由组件树内部底层的`setState`导致的错误，其仍能够正确地传递到最近的错误边界。

## 自React 15开始的命名变更

React 15 在不同的方法名下为错误边界包含了一个非常有限的支持：`unstable_handleError`。该方法不再生效，同时自React 16第一个测试版本发布开始，你需要在你的代码中将其修改为`componentDidCatch`。

为应对这一改变，我们已提供了[一份 codemod](https://github.com/reactjs/react-codemod#error-boundaries)以用于自动地迁移你的代码。
