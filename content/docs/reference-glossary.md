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

React元素是React应用程序的最小单位。初学者很可能把元素的定义和定义内涵更广的“组件”给搞混了。元素用来描述界面上的任何东西。 React 元素都是immutable不可变的。

```js
const element = <h1>Hello, world</h1>;
```

通常不直接使用元素，而是从组件返回。

## 组件 [Components](/docs/components-and-props.html)

React组件是小的，可复用的代码片段，它返回一个React元素用于渲染页面。 定义一个组件最简单的方式是使用JavaScript函数，它返回一个React元素：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

你也可以使用 ES6 class 来定义一个组件:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

组件可以按照功能分解成不同的部件，并在其他组件中使用。组件可以返回其他组件，数组，字符串或数字。当你的UI中有一部分重复使用了好几次（比如，Button、Panel、Avatar），或者其自身就足够复杂（比如，App、FeedStory、Comment），类似这些都是抽象成一个可复用组件的绝佳选择，这也是一个比较好的做法。 组件名称应始终以大写字母开头 (`<Wrapper/>` **而不是** `<wrapper/>`)。参见 [这里](/docs/components-and-props.html#rendering-a-component)获取更多有关渲染组件的信息。

### [`props`](/docs/components-and-props.html)

`props`是React组件的输入内容。 它们是从父组件传递给子组件的数据。

请记住，`props` 是只读的。 不应该以任何方式修改它们：

```js
// 错误!
props.number = 42;
```

如果你需要修改某些值以响应用户输入或网络响应，请使用`state`。

### `props.children`

`props.children`在每个组件上都可用。 它会包含组件的开始和结束标记之间的内容。 例如：

```js
<Welcome>Hello world!</Welcome>
```

在`Welcome`组件中的`props.children`中可以获取字符串`Hello world！`：

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

当某个组件与其关联的某些数据随时间而改变时，组件中需要使用`state`。例如，`Checkbox`组件中的状态需要转变为`isChecked`，或者`NewsFeed` 组件可能希望追踪其状态中的`fetchedPosts`。

`state`和`props`之间最重要的区别是`props`是从父组件传递的，而`state`是由组件本身管理的。组件不能改变其`props`，但可以改变`state`。 通过使用`this.setState()`。 只有定义为类的组件才可以具有状态。

对于每一个特定的变化数据，应该只有一个“拥有”它的状态的组件。不要尝试同步两个不同组件的状态。状态分享通过[状态提升](/docs/lifting-state-up.html)至最近的父组件来完成，并通过`props`传递给他们。

## 生命周期函数 [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)

生命周期函数是在组件的不同阶段可执行自定义功能的钩子。当组件被创建并插入到DOM中时，可用函数([mounting](/docs/react-component.html#mounting))，组件更新，以及从DOM卸载或移除组件时可以使用对应的生命周期函数。

 ## 受控 & 非受控组件 [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React有两种不同的方法来处理表单输入。

值由React控制的输入表单元素称为*受控组件*。当用户将数据输入到受控组件中时，会触发状态改变的事件处理程序，并且你的代码将决定输入是否有效（使用更新的值重新渲染）。如果你不重新渲染，那么表单元素将保持不变。

*非受控制组件*的表单元素在React之外工作。当用户将数据输入到表单域（输入框，下拉菜单等）时，不需要React做任何事情，更新的数据就会被呈现出来。这也意味着你不能强迫表单域都有一个确定的值。

在大多数情况下，你应该使用受控组件。

## 键值 [Keys](/docs/lists-and-keys.html) 

“键值”是创建元素数组时需要包含的特殊字符串属性。键值可以帮助React识别哪些元素被更改，添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。

确定的标识键值对于重新渲染很重要，这样React才可以确定何时添加，删除或重新排序元素。不要把类似由`Math.random()`生成的值赋给键值。在理想情况下，键值应该对应于来自数据的唯一且稳定的标识符，例如`post.id`。

## [Refs](/docs/refs-and-the-dom.html)

React支持一个可以附加到任何组件的特殊属性`ref`。`ref`属性可以是一个字符串或一个回调函数。当`ref`属性是一个回调函数时，函数接收底层DOM元素或类实例（取决于元素的类型）作为参数。这使你可以直接访问DOM元素或组件实例。

不要过度使用 Refs。如果你发现自己经常在应用程序中使用refs来“搞事情”，请考虑使用[状态提升](/docs/lifting-state-up.html)。

## 事件 [Events](/docs/handling-events.html) 

React元素的事件处理和DOM元素的很相似。但是有一点语法上的不同:

* React事件绑定属性的命名采用驼峰式写法，而不是小写。
* 如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)

## 协调 [Reconciliation](/docs/reconciliation.html)

当一个组件的props或状态发生变化时，React通过比较新返回的元素和先前渲染的元素来决定是否需要实际的DOM更新。当它们不相等时，React将更新DOM。 这个过程被称为“协调”。
