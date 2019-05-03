---
id: composition-vs-inheritance
title: 组合 vs 继承
permalink: docs/composition-vs-inheritance.html
redirect_from: "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React 具有强大的组合模型，我们建议使用组合而不是继承来复用组件之间的代码。

在本节中，我们将围绕几个 React 新手经常使用继承解决的问题，我们将展示如何用组合来解决它们。

## 包含关系

一些组件不能提前知道它们的子组件是什么。这对于 `Sidebar` 或 `Dialog` 这类通用容器尤其常见。

我们建议这些组件使用 `children` 属性将子元素直接传递到输出。

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

这样做还允许其他组件通过嵌套 JSX 来传递子组件。

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/ozqNOV?editors=0010)

`<FancyBorder>` JSX 标签内的任何内容都将通过 `children` 属性传入 `FancyBorder`。由于 `FancyBorder` 在一个 `<div>` 内渲染了 `{props.children}`，所以被传递的所有元素都会出现在最终输出中。

虽然不太常见，但有时你可能需要在组件中有多个入口，这种情况下你可以使用自己约定的属性而不是 `children`：

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/gwZOJp?editors=0010)

类似 `<Contacts />` 和 `<Chat />` 这样的 React 元素都是对象，所以你可以像任何其他元素一样传递它们。

## 特殊实例

有时我们认为组件是其他组件的特殊实例。例如，我们会说 `WelcomeDialog` 是 `Dialog` 的特殊实例。

在 React 中，这也是通过组合来实现的，通过配置属性用较特殊的组件来渲染较通用的组件。

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

组合对于定义为类的组件同样适用：

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## 那么继承呢？

在 Facebook 网站上，我们的 React 使用了数以千计的组件，然而却还未发现任何需要推荐你使用继承的情况。

属性和组合为你提供了以清晰和安全的方式自定义组件的样式和行为所需的所有灵活性。请记住，组件可以接受任意元素，包括基本数据类型、React 元素或函数。

如果要在组件之间复用 UI 无关的功能，我们建议将其提取到单独的 JavaScript 模块中。这样可以在不对组件进行扩展的前提下导入并使用该函数、对象或类。
