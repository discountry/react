---
id: （Context）上下文
title: Context
permalink: docs/context.html
---

Context 通过组件树提供了一个传递数据的方法，从而避免了在每一个层级手动的传递 props 属性。

在一个典型的 React 应用中，数据是通过 props 属性由上向下（由父及子）的进行传递的，但这对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI主题），这是应用程序中许多组件都所需要的。 Context 提供了一种在组件之间共享此类值的方式，而不必通过组件树的每个层级显式地传递 props 。

- [何时使用 Context](#when-to-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Provider](#provider)
  - [Consumer](#consumer)
- [Examples](#examples)
  - [Dynamic Context](#dynamic-context)
  - [Consuming Multiple Contexts](#consuming-multiple-contexts)
  - [Accessing Context in Lifecycle Methods](#accessing-context-in-lifecycle-methods)
  - [Consuming Context with a HOC](#consuming-context-with-a-hoc)
  - [Forwarding Refs to Context Consumers](#forwarding-refs-to-context-consumers)
- [Caveats](#caveats)
- [Legacy API](#legacy-api)


## 何时使用 Context

Context 设计目的是为共享那些被认为对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。例如，在下面的代码中，我们通过一个“theme”属性手动调整一个按钮组件的样式：

`embed:context/motivation-problem.js`

使用 context, 我可以避免通过中间元素传递 props：

`embed:context/motivation-solution.js`

> 注意
>
> 不要仅仅为了避免在几个层级下的组件传递 props 而使用 context，它是被用于在多个层级的多个组件需要访问相同数据的情景。

## API

### `React.createContext`

```js
const {Provider, Consumer} = React.createContext(defaultValue);
```

创建一对 `{ Provider, Consumer }`。当 React 渲染 context 组件 Consumer 时，它将从组件树的上层中最接近的匹配的 Provider 读取当前的 context 值。

如果上层的组件树没有一个匹配的 Provider，而此时你需要渲染一个 Consumer 组件，那么你可以用到 `defaultValue` 。这有助于在不封装它们的情况下对组件进行测试。

### `Provider`

```js
<Provider value={/* some value */}>
```

React 组件允许 Consumers 订阅 context 的改变。

接收一个 `value` 属性传递给 Provider 的后代 Consumers。一个 Provider 可以联系到多个 Consumers。Providers 可以被嵌套以覆盖组件树内更深层次的值。

### `Consumer`

```js
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```

一个可以订阅 context 变化的 React 组件。

接收一个 [函数作为子节点](/docs/render-props.html#using-props-other-than-render). 函数接收当前 context 的值并返回一个 React 节点。传递给函数的 `value` 将等于组件树中上层 context 的最近的 Provider 的 `value` 属性。如果 context 没有 Provider ，那么 `value` 参数将等于被传递给 `createContext()` 的 `defaultValue` 。



> 注意
>
> 关于此案例的更多信息, 请看 [render props](/docs/render-props.html).

每当Provider的值发送改变时, 作为Provider后代的所有Consumers都会重新渲染。 从Provider到其后代的Consumers传播不受shouldComponentUpdate方法的约束，因此即使祖先组件退出更新时，后代Consumer也会被更新。

通过使用与[Object.is](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)相同的算法比较新值和旧值来确定变化。

> 注意
>
>（这在传递对象作为 `value` 时会引发一些问题[Caveats](#caveats).）

## 例子

### 动态 Context

主题的动态值，一个更加复杂的例子：

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### 父子耦合

经常需要从组件树中某个深度嵌套的组件中更新 context。在这种情况下，可以通过 context 向下传递一个函数，以允许 Consumer 更新 context ：

**theme-context.js**
`embed:context/theme-nested-context.js`

**theme-toggler-button.js**
`embed:context/theme-nested-toggler-button.js`

**app.js**
`embed:context/app-nested.js`

### 作用于多个上下文

为了保持 context 快速进行二次渲染， React 需要使每一个 Consumer 在组件树中成为一个单独的节点。

`embed:context/multiple-contexts.js`

如果两个或者多个上下文的值经常被一起使用，也许你需要考虑你自己渲染属性的组件提供给它们。

### 在生命周期方法中访问 Context

在生命周期方法中从上下文访问值是一种相对常见的用例。而不是将上下文添加到每个生命周期方法中，只需要将它作为一个 props 传递，然后像通常使用 props 一样去使用它。

`embed:context/lifecycles.js`

### 高阶组件中的 Context

某些类型的上下文被许多组件（例如主题或者地点信息）共用。使用 `<Context.Consumer>` 元素显示地封装每个依赖项是冗余的。这里[higher-order component](/docs/higher-order-components.html)可以帮助我们解决这个问题。

例如，一个按钮组件也许被作用于一个主题 context：

`embed:context/higher-order-component-before.js`

这对于少量组件来说并没有毛病，但是如果我们想在很多地方使用主题上下文呢？

我们可以创建一个命名为 `withTheme` 高阶组件：

`embed:context/higher-order-component.js`

目前任何组件都依赖于主题 context，它们都可以很容易的使用我们创建的 `withTheme` 函数进行订阅。

`embed:context/higher-order-component-usage.js`

### 转发 Refs

一个关于渲染属性API的问题是 refs 不会自动的传递给被封装的元素。为了解决这个问题，使用 `React.forwardRef`：

**fancy-button.js**
`embed:context/forwarding-refs-fancy-button.js`

**app.js**
`embed:context/forwarding-refs-app.js`

## 告诫

因为 context 使用 `reference identity` 确定何时重新渲染，在 Consumer 中，当一个 Provider 的父节点重新渲染的时候，有一些问题可能触发意外的渲染。例如下面的代码，所有的 Consumner 在 Provider 重新渲染之时，每次都将重新渲染，因为一个新的对象总是被创建对应 Provider 里的 `value`：

`embed:context/reference-caveats-problem.js`


为了防止这样, 提升 `value` 到父节点的 state里:

`embed:context/reference-caveats-solution.js`

## 遗留 API

> 注意
>
> React 以前使用实验性的 context API运行，旧的API将会在16.x版本中得到支持，但使用到它的应用应该迁移到新版本。遗留的API将在未来的 React 版本中被移除。阅读[legacy context docs here](/docs/legacy-context.html)。
