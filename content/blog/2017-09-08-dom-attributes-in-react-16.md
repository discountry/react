---
title: "DOM Attributes in React 16"
author: [gaearon]
---

过去，React 习惯于忽视未知的 DOM 属性。若你在 JSX 中写了一个 React 无法识别的元素， React 将会忽略他。例如这样：

```js
// Your code:
<div mycustomattribute="something" />
```

在 React 15 中将会在 DOM 节点中渲染一个空的 div:

```js
// React 15 output:
<div />
```

在 React 16 中，我们做了一些改变。未知特性会在 DOM 节点的末尾：

```js
// React 16 output:
<div mycustomattribute="something" />
```

## 为何要改变？

React 为 DOM 提供了以 JavaScript 为核心的 API。由于 React 组件总是带有自定义以及 DOM 相关的 props，其使得 React 使用小驼峰命名会更易理解，类似于 DOM 的 API：

```js
<div tabIndex="-1" />
```

这并未改变。然而，过去这一方式强制我们在库中维护一个合法的 DOM 元素白名单：

```js
// ...
summary: 'summary',
tabIndex: 'tabindex'
target: 'target',
title: 'title',
// ...
```

这一方是有两个弊端：

* 你无法[传自定义属性](https://github.com/facebook/react/issues/140)。而这对于未标准化的浏览器相关的属性，尝试新的DOM API以及集成一些独特的第三方库。

* 属性列表不断地增长，但 大部分 React 独有的属性命名已在 DOM 中合法。移除白名单的大部分属性能够稍微减少库的大小。

随着新版本发布，这些问题都将解决。在 React 16 中，你可以传递自定义属性给所有的 HTML 和 SVG 元素，同时 React 也不必在将所有的属性白名单包含进生产版本里。

**注意，对于已知属性，你仍需要使用规范的 React 命名。**

```js
// Yes, please
<div tabIndex="-1" />

// Warning: Invalid DOM property `tabindex`. Did you mean `tabIndex`?
<div tabindex="-1" />
```

换句话说，你在 React 中使用 DOM 组件的方式并没有改变，但现在你有了新方式。

## 应该在属性中存储数据？

不。我们不鼓励奖数据存放在 DOM 属性中。即使你不得不，使用 `data-`
可能会是更好的方式，但大多数情况下数据应被保存在 React 组件状态或额外存储。

然而，若你需要使用非标准化的或是新的 DOM 属性那新特性将会十分方便，或若你需要与依赖这些新特性的第三方库进行整合。

## Data 和 ARIA 属性

和之前一样，React 能够让你随意地传递 `data-` 和 `aria-`：

```js
<div data-foo="42" />
<button aria-label="Close" onClick={onClose} />
```

这并没有改变。

[可访问性](/react/docs/accessibility.html) 非常重要，因此即使 React 16 能够传递任何属性，其仍然会在开发模式下验证 `aria-` props 是否正确命名，就像之前 React 15 一样。

## 迁移路径

自一年多前的 [React 15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0) 发布，我们已将[关于未知属性的一个警告](/react/warnings/unknown-prop.html) 包含在内。大量的第三方库也已进行代码升级。若你的应用在 React 15.2.0 或更高版本中并未产生警告，那么这一改变并不需要修改你应用中的代码。

若你仍意外地传递非 DOM props 到 DOM 组件中，在 React 16 你将会在 DOM 中开始看到这些特性，例如：

```js
<div myData='[Object object]' />
```

这在一定程度上是安全的（浏览器将会忽略他们）但当你看到他们时，我们建议你修复这些问题。一个潜在的问题是若你传递一个实现了自定义的 `toString()` 或 `valueOf()` 方法的对象将会抛出异常。另一个可能的问题是合法的 HTML 元素如 `align` 和 `valign` 现在会被传递给 DOM。它们过去则是被忽略，因为React 并不支持它们。

为避免这些问题，在升级到 React 16 之前，我们建议你修复你在 React 15中看到的这些警告。

## 变更细节

我们已做了一些其他调整已让行为能够更加可预测并能致力于让你不犯错。我们无法预期这些改变可能会破坏实际应用。

**这些变更仅影响 DOM 组件 如 `<div>`，而不会影响你自己的组件。**

下列是变更的细节。

* **带有字符，数字或对象值得未知属性：**
  
    ```js
    <div mycustomattribute="value" />
    <div mycustomattribute={42} />
    <div mycustomattribute={myObject} />
    ```

    React 15：警告并忽略。
    React 16：将值转换成字符串并传递给组件。

    *注意：以 `on` 开始的特性并不会被传递而是抛出异常因为这可能是一个潜在的安全漏洞。*

* **带有不同规范的 React 命名的已知属性：**
  
    ```js
    <div tabindex="-1" />
    <div class="hi" />
    ```

    React 15：警告并忽略。
    React 16：警告但会将其转换为字符串并传递给组件。

    *注意：永远对支持的特性使用规范的 React 命名规则。*

* **带有布尔值的非布尔值特性：**

    ```js
    <div className={false} />
    ```

    React 15：将布尔值转换为字符串并传递给组件
    React 16：警告并忽略。

* **带有函数的非事件特性：**

    ```js
    <div className={function() {}} />
    ```

    React 15：将函数转换为字符串并传递给组件。
    React 16：警告并忽略。

* **带有 Symbol 的属性：**

    ```js
    <div className={Symbol('foo')} />
    ```

    React 15：崩溃。
    React 16：警告并忽略。

* **带有 `NaN` 值的属性：**

    ```js
    <div tabIndex={0 / 0} />
    ```

    React 16：将 `NaN` 转换为字符串并传递给组件。
    React 16：警告并忽略。

随这一测试版的发布，我们也为所有已知元素[创建一个自动生成的表单](https://github.com/facebook/react/blob/master/fixtures/attribute-behavior/AttributeTableSnapshot.md)以追踪潜在的问题。

## 试一试

你可以在 [CodePen](https://codepen.io/gaearon/pen/gxNVdP?editors=0010) 尝试这些变更。其使用 React 16 RC 版本，你也可以 [在你的项目中帮助我们测试 RC](https://github.com/facebook/react/issues/10294)。

## 感谢

这一努力大部分由一位 [Nathan Hunzaker](https://github.com/nhunzaker) 所推动， [其是一位高产的 React 外部贡献者](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anhunzaker+is%3Aclosed)。

你可以在过去一年的历程里在下列几个 PR 的这个问题上发现他的工作：
[#6459](https://github.com/facebook/react/pull/6459)、[#7311](https://github.com/facebook/react/pull/7311)、[#10229](https://github.com/facebook/react/pull/10229)、[#10397](https://github.com/facebook/react/pull/10397)、[#10385](https://github.com/facebook/react/pull/10385) 和 [#10470](https://github.com/facebook/react/pull/10470)。

在一个受欢迎的项目中核心的调整需要花费大量时间和研究。Nathan 展示了坚定的决心并承诺完成这一调整，我们非常感谢他的这一工作及其他的贡献。

我们也想要感谢 [Brandon Dail](https://github.com/aweary) 和 [Jason Quense](https://github.com/jquense) 在这一年中无私地帮助维护 React 项目。

## 未来计划

我们还未调整 [自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) 如何在 React 16 中工作，但关于设置属性而非特性已经有了一些[讨论](https://github.com/facebook/react/issues/7249)，我们可能在 React 17 中在回过头来看看。若你愿意提供帮助，随时都可以来提。
