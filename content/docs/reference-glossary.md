---
id: glossary
title: React 术语表
layout: docs
category: Reference
permalink: docs/glossary.html

---

## 单页面应用 Single-page Application

单页面应用，第一次会加载应用程序运行所需的单个的HTML页面和所有必需的资源（如JavaScript和CSS）。 之后任何与页面或后续页面的交互都不需要再往返于服务器，即页面不会再被重新加载。

尽管你可以通过React构建一个单页面应用，但单页面应用对于React而言并不是必需的。 React也可以只用于现有网站中的一小部分以增加交互性。 用React编写的代码可以和服务端渲染标记（如PHP）或其他客户端库完美兼容。 事实上，React在Facebook中也是这样使用的。

## ES6, ES2015, ES2016等

这些缩略词都是指最新版本的ECMAScript语言规范标准，而JavaScript语言是它们的一个实现。ES6版本（也被称为ES2015）包括许多新特性，如：箭头函数、类(class)、模板字面量、`let` 和 `const` 变量声明等。你可以在[这里](https://en.wikipedia.org/wiki/ECMAScript#Versions)了解更多版本新特性。

## 编译器 Compilers

JavaScript编译器用于转换JavaScript代码，并用其它格式返回JavaScript代码。最常见的用例是采用ES6语法编写代码并将其转换为旧版浏览器能够识别的语法。 React最常用的编译器是[Babel](https://babeljs.io/)。

## 打包工具 Bundlers

开发中将JavaScript和CSS代码编写为单独的模块（通常为数百个），打包工具会针对浏览器将它们组合并优化为几个文件。[Webpack](https://webpack.js.org/)和[Browserify](http://browserify.org/)是在React应用程序中常用的打包工具。

## 包管理工具 Package Managers

包管理工具允许你通过依赖项来管理项目。[npm](https://www.npmjs.com/) 和 [Yarn](http://yarnpkg.com/)是React应用程序中常用的包管理工具。它们都是使用相同npm包注册表的客户端。

## CDN

CDN即内容分发网络。 CDN从全球各地的服务器网络提供静态内容的缓存。

## JSX

JSX是一种JavaScript的语法扩展。JSX与模板语言相似，但它具有JavaScript的全部功能。JSX会被编译为`React.createElement()`方法调用，将返回名为“React elements”的普通JavaScript对象。JSX的基本教程参见[这里](/docs/introducing-jsx.html)，更多高级指引参见[这里](/docs/jsx-in-depth.html)。

React DOM使用属性名称使用驼峰法代替HTML属性名称。例如，`tabindex`在JSX中写作`tabIndex`。由于`class`是JavaScript中的保留字，`class`属性用`className`替代：

```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">My name is {name}!</h1>,
  document.getElementById('root')
);
```

## 元素 [Elements](/docs/rendering-elements.html)

React元素是React应用程序的构建块。有人可能分不清元素和更广泛被知道“组件”的概念。元素用来描述你希望在屏幕上看到什么。 React元素是不可变的。

```js
const element = <h1>Hello, world</h1>;
```

通常不直接使用元素，而是从组件中返回它。

## 组件 [Components](/docs/components-and-props.html)

React组件是小的，可复用的代码片段，它返回一个React元素用于渲染页面。 React组件的最简单版本是一个普通JavaScript函数，它返回一个React元素：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

你也可以使用 ES6 类来定义一个组件:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

组件可以分解到不同的功能块中，并在其他组件中使用。组件可以返回其他组件，数组，字符串或数字。一个好的拇指规则是，如果你的UI中有一部分使用了好几次（Button、Panel、Avatar），或者其自身就足够复杂（App、FeedStory、Comment），类似这些都是可复用组件的绝佳选择。组件名称应始终首字母大写 (`<Wrapper/>` **而不是** `<wrapper/>`)。参见 [这里](/docs/components-and-props.html#rendering-a-component)获取更多有关渲染组件的信息。

### [`props`](/docs/components-and-props.html)

`props`是React组件的输入。 它们是从父组件向下传递给子组件的数据。

请记住，`props` 是只读的。 不应该以任何方式修改它们：

```js
// 错误!
props.number = 42;
```

如果你需要修改某些值以响应用户输入或网络响应，请使用`state`来代替。

### `props.children`

`props.children`在每个组件上都可用。 它会包含组件的开始和结束标记之间的内容。 例如：

```js
<Welcome>Hello world!</Welcome>
```

字符串`Hello world！`，在`Welcome`组件中可以从`props.children`中获取：

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

定义成类组件时，使用`this.props.children`：

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### 状态 [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class)

当一个组件与其关联的某些数据随时间而改变时，需要使用`state`。例如，`Checkbox`组件的可能需要`isChecked`在它的状态中，或者`NewsFeed` 组件可能希望追踪`fetchedPosts`在它的状态中。

`state`和`props`之间最重要的区别是`props`是从父组件传递的，而`state`是由组件本身管理的。组件不能改变自己的`props`，但可以改变自己的`state`。 要改变状态，组件必须调用`this.setState()`。 只有定义为类的组件才可以具有状态。

对于特定的每一个变化的数据，应该只有一个组件“拥有”它在状态中。不要尝试同步两个不同组件的状态。代替，[状态提升](/docs/lifting-state-up.html)至它们最近的共享的祖先，然后作为`props`向下传递状态给他们两个。

## 生命周期方法 [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)

生命周期方法是在组件的不同阶段来执行的自定义功能。当组件被创建并插入到DOM中时，生命周期方法可用在以下的时候：([装载](/docs/react-component.html#mounting))时，组件更新时，以及从DOM卸载或移除组件时。

 ## 受控 & 非受控组件 [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React有两种不同的方法来处理表单输入。

输入表单元素，它的值由React控制的称为*受控组件*。当用户将数据输入到受控组件中时，会触发一个改变事件处理器，并且你的代码将决定输入是否有效（使用更新的值重新渲染）。如果你不重新渲染，那么表单元素将保持不变。

*非受控制组件*的表单元素在React之外工作。当用户将数据输入到表单域（输入框，下拉菜单等）时，不需要React做任何事情，更新的数据就会被呈现出来。这也意味着你不能强迫表单域都有一个确定的值。

在大多数情况下，你应该使用受控组件。

## 键 [Keys](/docs/lists-and-keys.html) 

一个“键”是一个特殊的字符串属性，当创建元素的数组时，你需要包括键。键可以帮助React识别哪些项目被更改，添加或删除。键应该放到数组内部的元素中，以使得元素有一个稳定的标识。

Keys only need to be unique among sibling elements in the same array. They don't need to be unique across the whole application or even a single component.

不要把类似由`Math.random()`生成的值赋给键值。键有一个跨重新渲染的“稳定的标识”是很重要的，这样React才可以确定何时添加，删除或重新排序项目。在理想情况下，键值应该对应于来自于你的数据的唯一且稳定的标识符，例如`post.id`。

## [Refs](/docs/refs-and-the-dom.html)

React支持一个可以附加到任何组件的特殊属性`ref`。`ref`属性可以是一个字符串或一个回调函数。当`ref`属性是一个回调函数时，函数接收底层DOM元素或类实例（取决于元素的类型）作为参数。这使你可以直接访问DOM元素或组件实例。

不要过度使用 Refs。如果你发现自己经常在应用程序中使用refs来“搞事情”，请考虑使用[状态提升](/docs/lifting-state-up.html)。

## 事件 [Events](/docs/handling-events.html) 

React元素的事件处理有一些语法上的不同：

* React事件处理器采用小驼峰命名法，而不是小写。
* 用JSX你需要传入一个函数作为事件处理器，而不是一个字符串。

## 协调 [Reconciliation](/docs/reconciliation.html)

当一个组件的props或状态发生变化时，React通过比较新返回的元素和先前渲染的元素来决定是否需要实际的DOM更新。当它们不相等时，React将更新DOM。 这个过程被称为“协调”。
