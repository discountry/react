---
id: react-without-jsx
title: 不使用 JSX
permalink: docs/react-without-jsx.html
---

编写React的时候，JSX并不是必须的。当你不想在你的构建环境中安装相关编译工具的时候，不使用JSX编写React会比较方便。

每一个JSX元素都只是 `React.createElement(component, props, ...children)` 的语法糖。因此，任何时候你用JSX语法写的代码也可以用普通的 JavaScript 语法写出来。

例如，下面这段代码是用JSX语法写的：

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

可以被编译成下面这段不使用JSX的代码：

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

如果你很好奇想了解更多关于JSX如何被转化为 JavaScript 的例子，你可以尝试下这个[在线Babel编译器](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D)。

一个组件可以是一个字符串，或者也可以是`React.Component的子类。当组件是无状态组件的时候，它也可以是一个普通的函数。


如果你对于每次都要输入 `React.createElement` 感到非常厌倦，这是一种常用的简写形式：

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

如果你使用 `React.createElement` 的简写形式，这将很方便的去编写不使用 JSX 的 React.

其它选择的话，你可以去参考社区上的项目例如[`react-hyperscript`](https://github.com/mlmorg/react-hyperscript)和 [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) 。它们都提供了一些简洁的语法。

